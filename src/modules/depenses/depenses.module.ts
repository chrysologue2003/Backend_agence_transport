import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Depense } from './entities/depense.entity.js';
import { DepensesService } from './depenses.service.js';
import { DepensesController } from './depenses.controller.js';
import { CategorieDepense } from '../categories-depenses/entities/categorie-depense.entity.js';
import { Vehicule } from '../vehicules/entities/vehicule.entity.js';
import { MouvementCaisse } from '../caisse/entities/mouvement-caisse.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Depense,
      CategorieDepense,
      Vehicule,
      MouvementCaisse,
    ]),
  ],
  controllers: [DepensesController],
  providers: [DepensesService],
  exports: [DepensesService, TypeOrmModule],
})
export class DepensesModule {}
