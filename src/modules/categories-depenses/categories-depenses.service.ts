import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategorieDepense } from './entities/categorie-depense.entity.js';
import { CreateCategorieDepenseDto } from './dto/create-categorie-depense.dto.js';
import { UpdateCategorieDepenseDto } from './dto/update-categorie-depense.dto.js';

@Injectable()
export class CategoriesDepensesService {
  constructor(
    @InjectRepository(CategorieDepense)
    private readonly categorieRepository: Repository<CategorieDepense>,
  ) {}

  async findAll(): Promise<CategorieDepense[]> {
    return this.categorieRepository.find();
  }

  async findOne(id: string): Promise<CategorieDepense> {
    const cat = await this.categorieRepository.findOne({ where: { id } });
    if (!cat)
      throw new NotFoundException(`Catégorie de dépense #${id} introuvable`);
    return cat;
  }

  async create(dto: CreateCategorieDepenseDto): Promise<CategorieDepense> {
    return this.categorieRepository.save(this.categorieRepository.create(dto));
  }

  async update(id: string, dto: UpdateCategorieDepenseDto): Promise<CategorieDepense> {
    const cat = await this.findOne(id);
    Object.assign(cat, dto);
    return this.categorieRepository.save(cat);
  }

  async remove(id: string): Promise<void> {
    const cat = await this.findOne(id);
    await this.categorieRepository.remove(cat);
  }
}
