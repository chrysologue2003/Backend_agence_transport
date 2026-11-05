import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { RecettesService } from './recettes.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { RoleLibelle } from '../roles/enums/role-libelle.enum.js';

@ApiTags('recettes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('recettes')
export class RecettesController {
  constructor(private readonly service: RecettesService) {}

  @Get()
  @Roles(RoleLibelle.ADMINISTRATEUR, RoleLibelle.RESPONSABLE, RoleLibelle.COMPTABLE_CAISSIER)
  @ApiOperation({ summary: 'Lister toutes les recettes (lecture seule, paginé)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async findAll(@Query('page') page = '1', @Query('limit') limit = '20') {
    return {
      message: 'Liste des recettes',
      data: await this.service.findAll(+page, +limit),
    };
  }

  @Get(':id')
  @Roles(RoleLibelle.ADMINISTRATEUR, RoleLibelle.RESPONSABLE, RoleLibelle.COMPTABLE_CAISSIER)
  @ApiOperation({ summary: 'Obtenir une recette par son ID' })
  @ApiParam({ name: 'id', description: 'UUID de la recette' })
  async findOne(@Param('id') id: string) {
    return {
      message: 'Recette trouvée',
      data: await this.service.findOne(id),
    };
  }
}
