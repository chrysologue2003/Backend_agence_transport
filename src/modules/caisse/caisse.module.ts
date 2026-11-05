import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MouvementCaisse } from './entities/mouvement-caisse.entity.js';
import { CaisseService } from './caisse.service.js';
import { CaisseController } from './caisse.controller.js';
import { Recette } from '../recettes/entities/recette.entity.js';
import { Depense } from '../depenses/entities/depense.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([MouvementCaisse, Recette, Depense]),
  ],
  controllers: [CaisseController],
  providers: [CaisseService],
  exports: [CaisseService, TypeOrmModule],
})
export class CaisseModule {}
