import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chauffeur } from './entities/chauffeur.entity.js';
import { CreateChauffeurDto } from './dto/create-chauffeur.dto.js';
import { UpdateChauffeurDto } from './dto/update-chauffeur.dto.js';

@Injectable()
export class ChauffeursService {
  constructor(
    @InjectRepository(Chauffeur)
    private readonly chauffeurRepository: Repository<Chauffeur>,
  ) {}

  async findAll(page = 1, limit = 20): Promise<{ data: Chauffeur[]; total: number }> {
    const [data, total] = await this.chauffeurRepository.findAndCount({
      skip: (page - 1) * limit, take: limit, order: { matricule: 'ASC' },
    });
    return { data, total };
  }

  async findOne(matricule: string): Promise<Chauffeur> {
    const c = await this.chauffeurRepository.findOne({ where: { matricule } });
    if (!c) throw new NotFoundException(`Chauffeur "${matricule}" introuvable`);
    return c;
  }

  async create(dto: CreateChauffeurDto): Promise<Chauffeur> {
    const existing = await this.chauffeurRepository.findOne({ where: { matricule: dto.matricule } });
    if (existing)
      throw new ConflictException(`Le matricule "${dto.matricule}" est déjà enregistré`);
    return this.chauffeurRepository.save(this.chauffeurRepository.create(dto));
  }

  async update(matricule: string, dto: UpdateChauffeurDto): Promise<Chauffeur> {
    const c = await this.findOne(matricule);
    Object.assign(c, dto);
    return this.chauffeurRepository.save(c);
  }

  async remove(matricule: string): Promise<void> {
    const c = await this.findOne(matricule);
    await this.chauffeurRepository.remove(c);
  }
}
