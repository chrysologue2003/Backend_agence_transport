import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CaisseService } from './caisse.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { RoleLibelle } from '../roles/enums/role-libelle.enum.js';

@ApiTags('caisse')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('caisse')
export class CaisseController {
  constructor(private readonly service: CaisseService) {}

  @Get('mouvements')
  @Roles(RoleLibelle.ADMINISTRATEUR, RoleLibelle.RESPONSABLE, RoleLibelle.COMPTABLE_CAISSIER)
  @ApiOperation({ summary: 'Lister les mouvements de caisse (paginé)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async findMouvements(@Query('page') page = '1', @Query('limit') limit = '20') {
    return {
      message: 'Mouvements de caisse récupérés',
      data: await this.service.findMouvements(+page, +limit),
    };
  }

  @Get('solde')
  @Roles(RoleLibelle.ADMINISTRATEUR, RoleLibelle.RESPONSABLE, RoleLibelle.COMPTABLE_CAISSIER)
  @ApiOperation({ summary: 'Calculer le solde sur une période (recettes - dépenses)' })
  @ApiQuery({ name: 'from', required: true, example: '2026-08-01', description: 'Date de début (YYYY-MM-DD)' })
  @ApiQuery({ name: 'to', required: true, example: '2026-08-28', description: 'Date de fin (YYYY-MM-DD)' })
  async calculateSolde(@Query('from') from: string, @Query('to') to: string) {
    return {
      message: 'Calcul du solde effectué',
      data: await this.service.calculateSolde(from, to),
    };
  }
}
