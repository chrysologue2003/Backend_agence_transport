import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypePrestation } from './entities/type-prestation.entity.js';
import { TypesPrestationsService } from './types-prestations.service.js';
import { TypesPrestationsController } from './types-prestations.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([TypePrestation])],
  controllers: [TypesPrestationsController],
  providers: [TypesPrestationsService],
  exports: [TypeOrmModule],
})
export class TypesPrestationsModule {}
