import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chauffeur } from './entities/chauffeur.entity.js';
import { ChauffeursService } from './chauffeurs.service.js';
import { ChauffeursController } from './chauffeurs.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Chauffeur])],
  controllers: [ChauffeursController],
  providers: [ChauffeursService],
  exports: [TypeOrmModule],
})
export class ChauffeursModule {}
