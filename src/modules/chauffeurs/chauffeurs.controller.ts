import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus,
  Param, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ChauffeursService } from './chauffeurs.service.js';
import { CreateChauffeurDto } from './dto/create-chauffeur.dto.js';
import { UpdateChauffeurDto } from './dto/update-chauffeur.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { RoleLibelle } from '../roles/enums/role-libelle.enum.js';

@ApiTags('chauffeurs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('chauffeurs')
export class ChauffeursController {
  constructor(private readonly service: ChauffeursService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les chauffeurs (paginé)' })
  @ApiQuery({ name: 'page', required: false }) @ApiQuery({ name: 'limit', required: false })
  async findAll(@Query('page') page = '1', @Query('limit') limit = '20') {
    return { message: 'Liste des chauffeurs', data: await this.service.findAll(+page, +limit) };
  }

  @Get(':matricule')
  @ApiOperation({ summary: 'Obtenir un chauffeur par matricule' })
  @ApiParam({ name: 'matricule' })
  async findOne(@Param('matricule') matricule: string) {
    return { message: 'Chauffeur trouvé', data: await this.service.findOne(matricule) };
  }

  @Post()
  @Roles(RoleLibelle.ADMINISTRATEUR, RoleLibelle.RESPONSABLE)
  @ApiOperation({ summary: 'Enregistrer un chauffeur' })
  async create(@Body() dto: CreateChauffeurDto) {
    return { message: 'Chauffeur créé', data: await this.service.create(dto) };
  }

  @Patch(':matricule')
  @Roles(RoleLibelle.ADMINISTRATEUR, RoleLibelle.RESPONSABLE)
  @ApiOperation({ summary: 'Mettre à jour un chauffeur' })
  @ApiParam({ name: 'matricule' })
  async update(@Param('matricule') matricule: string, @Body() dto: UpdateChauffeurDto) {
    return { message: 'Chauffeur mis à jour', data: await this.service.update(matricule, dto) };
  }

  @Delete(':matricule')
  @Roles(RoleLibelle.ADMINISTRATEUR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer un chauffeur' })
  @ApiParam({ name: 'matricule' })
  async remove(@Param('matricule') matricule: string) {
    await this.service.remove(matricule);
    return { message: 'Chauffeur supprimé', data: null };
  }
}
