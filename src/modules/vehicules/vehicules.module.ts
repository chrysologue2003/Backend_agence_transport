import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicule } from './entities/vehicule.entity.js';
import { VehiculesService } from './vehicules.service.js';
import { VehiculesController } from './vehicules.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicule])],
  controllers: [VehiculesController],
  providers: [VehiculesService],
  exports: [TypeOrmModule],
})
export class VehiculesModule {}
