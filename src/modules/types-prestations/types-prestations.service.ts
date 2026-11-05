import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypePrestation } from './entities/type-prestation.entity.js';
import { CreateTypePrestationDto } from './dto/create-type-prestation.dto.js';
import { UpdateTypePrestationDto } from './dto/update-type-prestation.dto.js';

@Injectable()
export class TypesPrestationsService {
  constructor(
    @InjectRepository(TypePrestation)
    private readonly typePrestationRepository: Repository<TypePrestation>,
  ) {}

  async findAll(): Promise<TypePrestation[]> {
    return this.typePrestationRepository.find();
  }

  async findOne(code: string): Promise<TypePrestation> {
    const type = await this.typePrestationRepository.findOne({
      where: { code },
    });
    if (!type)
      throw new NotFoundException(`Type de prestation "${code}" introuvable`);
    return type;
  }

  async create(dto: CreateTypePrestationDto): Promise<TypePrestation> {
    const existing = await this.typePrestationRepository.findOne({
      where: { code: dto.code },
    });
    if (existing)
      throw new ConflictException(
        `Le code "${dto.code}" est déjà utilisé`,
      );
    return this.typePrestationRepository.save(
      this.typePrestationRepository.create(dto),
    );
  }

  async update(
    code: string,
    dto: UpdateTypePrestationDto,
  ): Promise<TypePrestation> {
    const type = await this.findOne(code);
    Object.assign(type, dto);
    return this.typePrestationRepository.save(type);
  }

  async remove(code: string): Promise<void> {
    const type = await this.findOne(code);
    await this.typePrestationRepository.remove(type);
  }
}
