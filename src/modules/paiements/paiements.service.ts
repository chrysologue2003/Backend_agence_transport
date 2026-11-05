import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Paiement } from './entities/paiement.entity.js';
import { CreatePaiementDto } from './dto/create-paiement.dto.js';
import { Activite } from '../activites/entities/activite.entity.js';
import { Recette } from '../recettes/entities/recette.entity.js';
import { MouvementCaisse, TypeMouvement } from '../caisse/entities/mouvement-caisse.entity.js';

@Injectable()
export class PaiementsService {
  constructor(
    @InjectRepository(Paiement)
    private readonly paiementRepository: Repository<Paiement>,
    @InjectRepository(Activite)
    private readonly activiteRepository: Repository<Activite>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(page = 1, limit = 20): Promise<{ data: Paiement[]; total: number }> {
    const [data, total] = await this.paiementRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: { activite: true, created_by: true },
      order: { created_at: 'DESC' },
    });
    return { data, total };
  }

  async findOne(id: string): Promise<Paiement> {
    const p = await this.paiementRepository.findOne({
      where: { id },
      relations: { activite: true, created_by: true },
    });
    if (!p) throw new NotFoundException(`Paiement #${id} introuvable`);
    return p;
  }

  async getPaymentsTotalForActivity(activityId: string): Promise<number> {
    const result = await this.paiementRepository
      .createQueryBuilder('p')
      .select('SUM(p.montant)', 'sum')
      .where('p.activite_id = :activityId', { activityId })
      .getRawOne();
    return parseFloat(result?.sum || '0');
  }

  async create(dto: CreatePaiementDto, userPayload: any): Promise<Paiement> {
    return this.dataSource.transaction(async (manager) => {
      // 1. Get Activity
      const activite = await manager.findOne(Activite, {
        where: { id: dto.activite_id },
        relations: { type_prestation: true },
      });
      if (!activite)
        throw new NotFoundException(`Activité #${dto.activite_id} introuvable`);

      // Verify that activity is not canceled
      if (activite.statut === 'ANNULEE') {
        throw new BadRequestException(
          `Impossible d'enregistrer un paiement sur une activité annulée`,
        );
      }

      // Check if payment amount is valid
      const currentPaymentsSum = await this.getPaymentsTotalForActivity(activite.id);
      const remainingToPay = activite.prix - currentPaymentsSum;
      if (dto.montant > remainingToPay + 0.01) {
        throw new BadRequestException(
          `Le montant du paiement (${dto.montant}) dépasse le reste à payer (${remainingToPay})`,
        );
      }

      // 2. Create Payment
      const paiement = manager.create(Paiement, {
        activite_id: dto.activite_id,
        date_paiement: new Date(dto.date_paiement),
        montant: dto.montant,
        mode_paiement: dto.mode_paiement,
        reference: dto.reference ?? null,
        created_by_id: userPayload.sub,
      });
      const savedPaiement = await manager.save(Paiement, paiement);

      // 3. Update Activity reste_a_payer directly
      activite.reste_a_payer = remainingToPay - dto.montant;
      await manager.save(Activite, activite);

      // 4. Create Recette (RG5)
      const recette = manager.create(Recette, {
        paiement_id: savedPaiement.id,
        date_recette: new Date(dto.date_paiement),
        type_prestation: activite.type_prestation?.libelle || 'Inconnu',
        montant: dto.montant,
        user_id: userPayload.sub,
      });
      await manager.save(Recette, recette);

      // 5. Create MouvementCaisse ENTREE (RG5)
      const latestMovement = await manager.findOne(MouvementCaisse, {
        where: {},
        order: { date_mouvement: 'DESC', id: 'DESC' },
      });
      const latestSolde = latestMovement
        ? parseFloat(latestMovement.solde_apres as any)
        : 0;
      const newSolde = latestSolde + dto.montant;

      const mouvement = manager.create(MouvementCaisse, {
        type_mouvement: TypeMouvement.ENTREE,
        montant: dto.montant,
        source: `Paiement: ${savedPaiement.id}`,
        solde_apres: newSolde,
      });
      await manager.save(MouvementCaisse, mouvement);

      return savedPaiement;
    });
  }

  async remove(id: string): Promise<void> {
    const p = await this.findOne(id);
    await this.dataSource.transaction(async (manager) => {
      await manager.remove(Paiement, p);
      // Recalculate remaining to pay for the activity directly
      const activite = await manager.findOne(Activite, {
        where: { id: p.activite_id },
      });
      if (activite) {
        const sumResult = await manager
          .createQueryBuilder(Paiement, 'pay')
          .select('SUM(pay.montant)', 'sum')
          .where('pay.activite_id = :activityId', { activityId: activite.id })
          .getRawOne();
        const paymentsTotal = parseFloat(sumResult?.sum || '0');
        activite.reste_a_payer = activite.prix - paymentsTotal;
        await manager.save(Activite, activite);
      }
    });
  }
}
