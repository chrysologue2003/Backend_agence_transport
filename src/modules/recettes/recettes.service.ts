import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recette } from './entities/recette.entity.js';

@Injectable()
export class RecettesService {
  constructor(
    @InjectRepository(Recette)
    private readonly recetteRepository: Repository<Recette>,
  ) {}

  async findAll(page = 1, limit = 20): Promise<{ data: Recette[]; total: number }> {
    const [data, total] = await this.recetteRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: { user: true, paiement: true },
      order: { date_recette: 'DESC', id: 'DESC' },
    });
    return { data, total };
  }

  async findOne(id: string): Promise<Recette> {
    const r = await this.recetteRepository.findOne({
      where: { id },
      relations: { user: true, paiement: true },
    });
    if (!r) throw new NotFoundException(`Recette #${id} introuvable`);
    return r;
  }
}
