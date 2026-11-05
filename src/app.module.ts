import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { RolesModule } from './modules/roles/roles.module.js';
import { TypesPrestationsModule } from './modules/types-prestations/types-prestations.module.js';
import { CategoriesDepensesModule } from './modules/categories-depenses/categories-depenses.module.js';
import { ClientsModule } from './modules/clients/clients.module.js';
import { VehiculesModule } from './modules/vehicules/vehicules.module.js';
import { ChauffeursModule } from './modules/chauffeurs/chauffeurs.module.js';
import { ActivitesModule } from './modules/activites/activites.module.js';
import { PaiementsModule } from './modules/paiements/paiements.module.js';
import { DepensesModule } from './modules/depenses/depenses.module.js';
import { RecettesModule } from './modules/recettes/recettes.module.js';
import { CaisseModule } from './modules/caisse/caisse.module.js';

import { Role } from './modules/roles/entities/role.entity.js';
import { User } from './modules/users/entities/user.entity.js';
import { TypePrestation } from './modules/types-prestations/entities/type-prestation.entity.js';
import { CategorieDepense } from './modules/categories-depenses/entities/categorie-depense.entity.js';
import { Client } from './modules/clients/entities/client.entity.js';
import { Vehicule } from './modules/vehicules/entities/vehicule.entity.js';
import { Chauffeur } from './modules/chauffeurs/entities/chauffeur.entity.js';
import { Activite } from './modules/activites/entities/activite.entity.js';
import { Paiement } from './modules/paiements/entities/paiement.entity.js';
import { Recette } from './modules/recettes/entities/recette.entity.js';
import { Depense } from './modules/depenses/entities/depense.entity.js';
import { MouvementCaisse } from './modules/caisse/entities/mouvement-caisse.entity.js';

import { SeedService } from './database/seed.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', '1234'),
        database: configService.get<string>('DB_NAME', 'DB_transpord'),
        entities: [
          Role,
          User,
          TypePrestation,
          CategorieDepense,
          Client,
          Vehicule,
          Chauffeur,
          Activite,
          Paiement,
          Recette,
          Depense,
          MouvementCaisse,
        ],
        synchronize: true,
        logging: configService.get<string>('NODE_ENV') === 'development',
      }),
    }),
    TypeOrmModule.forFeature([Role, User]),
    RolesModule,
    UsersModule,
    AuthModule,
    TypesPrestationsModule,
    CategoriesDepensesModule,
    ClientsModule,
    VehiculesModule,
    ChauffeursModule,
    ActivitesModule,
    PaiementsModule,
    DepensesModule,
    RecettesModule,
    CaisseModule,
  ],
  providers: [SeedService],
})
export class AppModule {}
