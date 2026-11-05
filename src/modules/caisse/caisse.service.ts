import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { MouvementCaisse } from './entities/mouvement-caisse.entity.js';
import { Recette } from '../recettes/entities/recette.entity.js';
import { Depense } from '../depenses/entities/depense.entity.js';

@Injectable()
export class CaisseService {
  constructor(
    @InjectRepository(MouvementCaisse)
    private readonly mouvementRepository: Repository<MouvementCaisse>,
    @InjectRepository(Recette)
    private readonly recetteRepository: Repository<Recette>,
    @InjectRepository(Depense)
    private readonly depenseRepository: Repository<Depense>,
  ) {}

  async findMouvements(page = 1, limit = 20): Promise<{ data: MouvementCaisse[]; total: number }> {
    const [data, total] = await this.mouvementRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { date_mouvement: 'DESC', id: 'DESC' },
    });
    return { data, total };
  }

  async calculateSolde(fromStr: string, toStr: string): Promise<{
    recettes_total: number;
    depenses_total: number;
    solde: number;
    solde_actuel: number;
    total_entrees_global: number;
    total_sorties_global: number;
    periode: { from: string; to: string };
  }> {
    if (!fromStr || !toStr) {
      throw new BadRequestException("Les paramètres 'from' et 'to' sont obligatoires (format YYYY-MM-DD)");
    }

    const fromDate = new Date(fromStr);
    const toDate = new Date(toStr);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      throw new BadRequestException("Format de date invalide. Utilisez YYYY-MM-DD");
    }

    // Adjust hours to cover the entire start/end days
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(23, 59, 59, 999);

    // 1. Get current real cash balance from the latest movement
    const dernierMouvement = await this.mouvementRepository.findOne({
      where: {},
      order: { date_mouvement: 'DESC', id: 'DESC' },
    });
    const soldeActuel = dernierMouvement ? parseFloat(dernierMouvement.solde_apres as any) : 0;

    // 2. Global all-time totals
    const globalRecetteRes = await this.recetteRepository
      .createQueryBuilder('r')
      .select('SUM(r.montant)', 'sum')
      .getRawOne();
    const totalEntreesGlobal = parseFloat(globalRecetteRes?.sum || '0');

    const globalDepenseRes = await this.depenseRepository
      .createQueryBuilder('d')
      .select('SUM(d.montant)', 'sum')
      .getRawOne();
    const totalSortiesGlobal = parseFloat(globalDepenseRes?.sum || '0');

    // 3. Period-filtered totals
    // Sum Recettes for the requested period
    const recetteResult = await this.recetteRepository
      .createQueryBuilder('r')
      .select('SUM(r.montant)', 'sum')
      .where('r.date_recette >= :from AND r.date_recette <= :to', { from: fromDate, to: toDate })
      .getRawOne();
    const recettesTotal = parseFloat(recetteResult?.sum || '0');

    // Sum Depenses for the requested period
    const depenseResult = await this.depenseRepository
      .createQueryBuilder('d')
      .select('SUM(d.montant)', 'sum')
      .where('d.date_depense >= :from AND d.date_depense <= :to', { from: fromDate, to: toDate })
      .getRawOne();
    const depensesTotal = parseFloat(depenseResult?.sum || '0');

    const solde = recettesTotal - depensesTotal;

    return {
      recettes_total: recettesTotal,
      depenses_total: depensesTotal,
      solde,
      solde_actuel: soldeActuel,
      total_entrees_global: totalEntreesGlobal,
      total_sorties_global: totalSortiesGlobal,
      periode: {
        from: fromStr,
        to: toStr,
      },
    };
  }
}
