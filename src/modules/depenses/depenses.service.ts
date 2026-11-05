import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Depense } from './entities/depense.entity.js';
import { CreateDepenseDto } from './dto/create-depense.dto.js';
import { UpdateDepenseDto } from './dto/update-depense.dto.js';
import { CategorieDepense } from '../categories-depenses/entities/categorie-depense.entity.js';
import { Vehicule } from '../vehicules/entities/vehicule.entity.js';
import { MouvementCaisse, TypeMouvement } from '../caisse/entities/mouvement-caisse.entity.js';

@Injectable()
export class DepensesService {
  constructor(
    @InjectRepository(Depense)
    private readonly depenseRepository: Repository<Depense>,
    @InjectRepository(CategorieDepense)
    private readonly categorieRepository: Repository<CategorieDepense>,
    @InjectRepository(Vehicule)
    private readonly vehiculeRepository: Repository<Vehicule>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(page = 1, limit = 20): Promise<{ data: Depense[]; total: number }> {
    const [data, total] = await this.depenseRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: { categorie: true, vehicule: true, user: true },
      order: { created_at: 'DESC' },
    });
    return { data, total };
  }

  async findOne(id: string): Promise<Depense> {
    const d = await this.depenseRepository.findOne({
      where: { id },
      relations: { categorie: true, vehicule: true, user: true },
    });
    if (!d) throw new NotFoundException(`Dépense #${id} introuvable`);
    return d;
  }

  async create(dto: CreateDepenseDto, userPayload: any): Promise<Depense> {
    return this.dataSource.transaction(async (manager) => {
      // 1. Verify Category
      const category = await manager.findOne(CategorieDepense, {
        where: { id: dto.categorie_id },
      });
      if (!category)
        throw new NotFoundException(`Catégorie de dépense #${dto.categorie_id} introuvable`);

      // 2. Verify Vehicle if provided
      if (dto.immatriculation) {
        const vehicle = await manager.findOne(Vehicule, {
          where: { immatriculation: dto.immatriculation },
        });
        if (!vehicle)
          throw new NotFoundException(`Véhicule "${dto.immatriculation}" introuvable`);
      }

      // 3. Create Expense
      const depense = manager.create(Depense, {
        date_depense: new Date(dto.date_depense),
        categorie_id: dto.categorie_id,
        description: dto.description,
        montant: dto.montant,
        immatriculation: dto.immatriculation ?? null,
        fournisseur: dto.fournisseur ?? null,
        mode_paiement: dto.mode_paiement ?? null,
        reference: dto.reference ?? null,
        justificatif: dto.justificatif ?? null,
        user_id: userPayload.sub,
        created_by_id: userPayload.sub,
      });

      const savedDepense = await manager.save(Depense, depense);

      // 4. Create MouvementCaisse of type SORTIE (RG7)
      const latestMovement = await manager.findOne(MouvementCaisse, {
        where: {},
        order: { date_mouvement: 'DESC', id: 'DESC' },
      });
      const latestSolde = latestMovement ? parseFloat(latestMovement.solde_apres as any) : 0;
      const newSolde = latestSolde - dto.montant;

      const mouvement = manager.create(MouvementCaisse, {
        type_mouvement: TypeMouvement.SORTIE,
        montant: dto.montant,
        source: `Dépense: ${savedDepense.id}`,
        solde_apres: newSolde,
      });
      await manager.save(MouvementCaisse, mouvement);

      return savedDepense;
    });
  }

  async remove(id: string): Promise<void> {
    const d = await this.findOne(id);
    await this.dataSource.transaction(async (manager) => {
      await manager.remove(Depense, d);
    });
  }
}
