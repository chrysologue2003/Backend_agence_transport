import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activite } from './entities/activite.entity.js';
import { ActivitesService } from './activites.service.js';
import { ActivitesController } from './activites.controller.js';
import { Client } from '../clients/entities/client.entity.js';
import { Vehicule } from '../vehicules/entities/vehicule.entity.js';
import { Chauffeur } from '../chauffeurs/entities/chauffeur.entity.js';
import { TypePrestation } from '../types-prestations/entities/type-prestation.entity.js';
import { PaiementsModule } from '../paiements/paiements.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Activite,
      Client,
      Vehicule,
      Chauffeur,
      TypePrestation,
    ]),
    PaiementsModule,
  ],
  controllers: [ActivitesController],
  providers: [ActivitesService],
  exports: [ActivitesService, TypeOrmModule],
})
export class ActivitesModule {}
