import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paiement } from './entities/paiement.entity.js';
import { PaiementsService } from './paiements.service.js';
import { PaiementsController } from './paiements.controller.js';
import { Activite } from '../activites/entities/activite.entity.js';
import { Recette } from '../recettes/entities/recette.entity.js';
import { MouvementCaisse } from '../caisse/entities/mouvement-caisse.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Paiement, Activite, Recette, MouvementCaisse]),
  ],
  controllers: [PaiementsController],
  providers: [PaiementsService],
  exports: [PaiementsService, TypeOrmModule],
})
export class PaiementsModule {}
