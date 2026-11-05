import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicule } from './entities/vehicule.entity.js';
import { CreateVehiculeDto } from './dto/create-vehicule.dto.js';
import { UpdateVehiculeDto } from './dto/update-vehicule.dto.js';

@Injectable()
export class VehiculesService {
  constructor(
    @InjectRepository(Vehicule)
    private readonly vehiculeRepository: Repository<Vehicule>,
  ) {}

  async findAll(page = 1, limit = 20): Promise<{ data: Vehicule[]; total: number }> {
    const [data, total] = await this.vehiculeRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { immatriculation: 'ASC' },
    });
    return { data, total };
  }

  async findOne(immatriculation: string): Promise<Vehicule> {
    const v = await this.vehiculeRepository.findOne({ where: { immatriculation } });
    if (!v) throw new NotFoundException(`Véhicule "${immatriculation}" introuvable`);
    return v;
  }

  async create(dto: CreateVehiculeDto): Promise<Vehicule> {
    const existing = await this.vehiculeRepository.findOne({
      where: { immatriculation: dto.immatriculation },
    });
    if (existing)
      throw new ConflictException(`L'immatriculation "${dto.immatriculation}" est déjà enregistrée`);
    return this.vehiculeRepository.save(this.vehiculeRepository.create(dto));
  }

  async update(immatriculation: string, dto: UpdateVehiculeDto): Promise<Vehicule> {
    const v = await this.findOne(immatriculation);
    Object.assign(v, dto);
    return this.vehiculeRepository.save(v);
  }

  async remove(immatriculation: string): Promise<void> {
    const v = await this.findOne(immatriculation);
    await this.vehiculeRepository.remove(v);
  }
}
