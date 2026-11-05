import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recette } from './entities/recette.entity.js';
import { RecettesService } from './recettes.service.js';
import { RecettesController } from './recettes.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Recette])],
  controllers: [RecettesController],
  providers: [RecettesService],
  exports: [RecettesService, TypeOrmModule],
})
export class RecettesModule {}
