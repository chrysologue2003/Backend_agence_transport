import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategorieDepense } from './entities/categorie-depense.entity.js';
import { CategoriesDepensesService } from './categories-depenses.service.js';
import { CategoriesDepensesController } from './categories-depenses.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([CategorieDepense])],
  controllers: [CategoriesDepensesController],
  providers: [CategoriesDepensesService],
  exports: [TypeOrmModule],
})
export class CategoriesDepensesModule {}
