import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activite } from './entities/activite.entity.js';
import { CreateActiviteDto } from './dto/create-activite.dto.js';
import { UpdateActiviteDto } from './dto/update-activite.dto.js';
import { Client } from '../clients/entities/client.entity.js';
import { Vehicule } from '../vehicules/entities/vehicule.entity.js';
import { Chauffeur } from '../chauffeurs/entities/chauffeur.entity.js';
import { TypePrestation } from '../types-prestations/entities/type-prestation.entity.js';
import { StatutActivite } from './enums/statut-activite.enum.js';
import { StatutVehicule } from '../vehicules/enums/statut-vehicule.enum.js';
import { StatutChauffeur } from '../chauffeurs/enums/statut-chauffeur.enum.js';
import { User } from '../users/entities/user.entity.js';
import { PaiementsService } from '../paiements/paiements.service.js';
import { ModePaiement } from '../../common/enums/mode-paiement.enum.js';

@Injectable()
export class ActivitesService {
  constructor(
    @InjectRepository(Activite)
    private readonly activiteRepository: Repository<Activite>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Vehicule)
    private readonly vehiculeRepository: Repository<Vehicule>,
    @InjectRepository(Chauffeur)
    private readonly chauffeurRepository: Repository<Chauffeur>,
    @InjectRepository(TypePrestation)
    private readonly typePrestationRepository: Repository<TypePrestation>,
    private readonly paiementsService: PaiementsService,
  ) {}

  async findAll(page = 1, limit = 20): Promise<{ data: Activite[]; total: number }> {
    const [data, total] = await this.activiteRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        client: true,
        vehicule: true,
        chauffeur: true,
        type_prestation: true,
        created_by: true,
      },
      order: { created_at: 'DESC' },
    });
    return { data, total };
  }

  async findOne(id: string): Promise<Activite> {
    const act = await this.activiteRepository.findOne({
      where: { id },
      relations: {
        client: true,
        vehicule: true,
        chauffeur: true,
        type_prestation: true,
        created_by: true,
      },
    });
    if (!act) throw new NotFoundException(`Activité #${id} introuvable`);
    return act;
  }

  async create(dto: CreateActiviteDto, userPayload: any): Promise<Activite> {
    // 1. Verify Client
    const client = await this.clientRepository.findOne({ where: { id: dto.client_id } });
    if (!client) throw new NotFoundException(`Client #${dto.client_id} introuvable`);

    // 2. Verify Type Prestation
    const typePrestation = await this.typePrestationRepository.findOne({
      where: { code: dto.type_prestation_code },
    });
    if (!typePrestation)
      throw new NotFoundException(`Type de prestation "${dto.type_prestation_code}" introuvable`);

    // 3. Verify Vehicle if provided (RG9)
    let vehicule: Vehicule | null = null;
    if (dto.immatriculation) {
      vehicule = await this.vehiculeRepository.findOne({
        where: { immatriculation: dto.immatriculation },
      });
      if (!vehicule)
        throw new NotFoundException(`Véhicule "${dto.immatriculation}" introuvable`);
      if (vehicule.statut !== StatutVehicule.DISPONIBLE) {
        throw new BadRequestException(
          `Le véhicule "${dto.immatriculation}" n'est pas DISPONIBLE (statut actuel : ${vehicule.statut})`,
        );
      }
    }

    // 4. Verify Chauffeur if provided (RG10)
    let chauffeur: Chauffeur | null = null;
    if (dto.matricule_chauffeur) {
      chauffeur = await this.chauffeurRepository.findOne({
        where: { matricule: dto.matricule_chauffeur },
      });
      if (!chauffeur)
        throw new NotFoundException(`Chauffeur "${dto.matricule_chauffeur}" introuvable`);
      if (chauffeur.statut !== StatutChauffeur.DISPONIBLE) {
        throw new BadRequestException(
          `Le chauffeur "${dto.matricule_chauffeur}" n'est pas DISPONIBLE (statut actuel : ${chauffeur.statut})`,
        );
      }
    }

    // Calculate initial reste_a_payer
    const prix = dto.prix;
    const avance = dto.avance ?? 0;
    const resteAPayer = prix - avance;

    const activite = this.activiteRepository.create({
      client_id: dto.client_id,
      immatriculation: dto.immatriculation ?? null,
      matricule_chauffeur: dto.matricule_chauffeur ?? null,
      type_prestation_code: dto.type_prestation_code,
      date_activite: new Date(dto.date_activite),
      destination: dto.destination ?? null,
      prix,
      avance,
      reste_a_payer: resteAPayer,
      statut: dto.statut ?? StatutActivite.EN_ATTENTE,
      observations: dto.observations ?? null,
      created_by_id: userPayload.sub,
    });

    const savedActivite = await this.activiteRepository.save(activite);

    // If activity starts in EN_COURS, update resource status
    if (savedActivite.statut === StatutActivite.EN_COURS) {
      if (vehicule) {
        vehicule.statut = StatutVehicule.EN_SERVICE;
        await this.vehiculeRepository.save(vehicule);
      }
      if (chauffeur) {
        chauffeur.statut = StatutChauffeur.EN_ACTIVITE;
        await this.chauffeurRepository.save(chauffeur);
      }
    }

    // If avance > 0, automatically trigger a payment (RG5)
    if (avance > 0) {
      await this.paiementsService.create(
        {
          activite_id: savedActivite.id,
          date_paiement: dto.date_activite,
          montant: avance,
          mode_paiement: ModePaiement.ESPECES,
          reference: 'Avance automatique',
        },
        userPayload,
      );
    }

    return this.findOne(savedActivite.id);
  }

  async update(id: string, dto: UpdateActiviteDto, userPayload: any): Promise<Activite> {
    const act = await this.findOne(id);

    // If activity is finished or canceled, forbid most changes
    if (act.statut === StatutActivite.TERMINEE || act.statut === StatutActivite.ANNULEE) {
      throw new BadRequestException(`Impossible de modifier une activité clôturée ou annulée`);
    }

    // Check status cycle transition (RG11)
    if (dto.statut && dto.statut !== act.statut) {
      const current = act.statut;
      const target = dto.statut;

      // Allow transition: EN_ATTENTE -> EN_COURS, EN_ATTENTE -> ANNULEE
      // Allow transition: EN_COURS -> TERMINEE, EN_COURS -> ANNULEE
      // Any other transition is invalid (e.g. TERMINEE -> EN_ATTENTE, ANNULEE -> EN_ATTENTE, EN_ATTENTE -> TERMINEE directly)
      if (current === StatutActivite.EN_ATTENTE) {
        if (target !== StatutActivite.EN_COURS && target !== StatutActivite.ANNULEE) {
          throw new BadRequestException(
            `Transition de statut invalide : ${current} vers ${target}`,
          );
        }
      } else if (current === StatutActivite.EN_COURS) {
        if (target !== StatutActivite.TERMINEE && target !== StatutActivite.ANNULEE) {
          throw new BadRequestException(
            `Transition de statut invalide : ${current} vers ${target}`,
          );
        }
      }

      // Handle status changes for vehicle and chauffeur
      if (target === StatutActivite.EN_COURS) {
        if (act.immatriculation) {
          const veh = await this.vehiculeRepository.findOne({
            where: { immatriculation: act.immatriculation },
          });
          if (veh) {
            veh.statut = StatutVehicule.EN_SERVICE;
            await this.vehiculeRepository.save(veh);
          }
        }
        if (act.matricule_chauffeur) {
          const chf = await this.chauffeurRepository.findOne({
            where: { matricule: act.matricule_chauffeur },
          });
          if (chf) {
            chf.statut = StatutChauffeur.EN_ACTIVITE;
            await this.chauffeurRepository.save(chf);
          }
        }
      } else if (target === StatutActivite.TERMINEE || target === StatutActivite.ANNULEE) {
        // Release vehicle and chauffeur
        if (act.immatriculation) {
          const veh = await this.vehiculeRepository.findOne({
            where: { immatriculation: act.immatriculation },
          });
          if (veh) {
            veh.statut = StatutVehicule.DISPONIBLE;
            await this.vehiculeRepository.save(veh);
          }
        }
        if (act.matricule_chauffeur) {
          const chf = await this.chauffeurRepository.findOne({
            where: { matricule: act.matricule_chauffeur },
          });
          if (chf) {
            chf.statut = StatutChauffeur.DISPONIBLE;
            await this.chauffeurRepository.save(chf);
          }
        }
      }

      act.statut = target;
    }

    // Verify Vehicle if changed (RG9)
    if (dto.immatriculation && dto.immatriculation !== act.immatriculation) {
      const vehicule = await this.vehiculeRepository.findOne({
        where: { immatriculation: dto.immatriculation },
      });
      if (!vehicule)
        throw new NotFoundException(`Véhicule "${dto.immatriculation}" introuvable`);
      if (vehicule.statut !== StatutVehicule.DISPONIBLE) {
        throw new BadRequestException(
          `Le véhicule "${dto.immatriculation}" n'est pas DISPONIBLE (statut actuel : ${vehicule.statut})`,
        );
      }
      act.immatriculation = dto.immatriculation;
    }

    // Verify Chauffeur if changed (RG10)
    if (dto.matricule_chauffeur && dto.matricule_chauffeur !== act.matricule_chauffeur) {
      const chauffeur = await this.chauffeurRepository.findOne({
        where: { matricule: dto.matricule_chauffeur },
      });
      if (!chauffeur)
        throw new NotFoundException(`Chauffeur "${dto.matricule_chauffeur}" introuvable`);
      if (chauffeur.statut !== StatutChauffeur.DISPONIBLE) {
        throw new BadRequestException(
          `Le chauffeur "${dto.matricule_chauffeur}" n'est pas DISPONIBLE (statut actuel : ${chauffeur.statut})`,
        );
      }
      act.matricule_chauffeur = dto.matricule_chauffeur;
    }

    if (dto.client_id) {
      const client = await this.clientRepository.findOne({ where: { id: dto.client_id } });
      if (!client) throw new NotFoundException(`Client #${dto.client_id} introuvable`);
      act.client_id = dto.client_id;
    }

    if (dto.type_prestation_code) {
      const type = await this.typePrestationRepository.findOne({
        where: { code: dto.type_prestation_code },
      });
      if (!type)
        throw new NotFoundException(`Type de prestation "${dto.type_prestation_code}" introuvable`);
      act.type_prestation_code = dto.type_prestation_code;
    }

    if (dto.date_activite) act.date_activite = new Date(dto.date_activite);
    if (dto.destination !== undefined) act.destination = dto.destination;
    if (dto.observations !== undefined) act.observations = dto.observations;

    if (dto.prix !== undefined) {
      act.prix = dto.prix;
      // Recalculate remaining to pay
      const paymentsTotal = await this.paiementsService.getPaymentsTotalForActivity(act.id);
      act.reste_a_payer = act.prix - paymentsTotal;
    }

    return this.activiteRepository.save(act);
  }

  // Update reste_a_payer (called by payments service when payments change)
  async updateResteAPayer(id: string): Promise<void> {
    const act = await this.activiteRepository.findOne({ where: { id } });
    if (!act) return;
    const paymentsTotal = await this.paiementsService.getPaymentsTotalForActivity(id);
    act.reste_a_payer = act.prix - paymentsTotal;
    await this.activiteRepository.save(act);
  }

  async remove(id: string): Promise<void> {
    const act = await this.findOne(id);
    await this.activiteRepository.remove(act);
  }
}
