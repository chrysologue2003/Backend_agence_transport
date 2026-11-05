import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus,
  Param, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { VehiculesService } from './vehicules.service.js';
import { CreateVehiculeDto } from './dto/create-vehicule.dto.js';
import { UpdateVehiculeDto } from './dto/update-vehicule.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { RoleLibelle } from '../roles/enums/role-libelle.enum.js';

@ApiTags('vehicules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vehicules')
export class VehiculesController {
  constructor(private readonly service: VehiculesService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les véhicules (paginé)' })
  @ApiQuery({ name: 'page', required: false }) @ApiQuery({ name: 'limit', required: false })
  async findAll(@Query('page') page = '1', @Query('limit') limit = '20') {
    return { message: 'Liste des véhicules', data: await this.service.findAll(+page, +limit) };
  }

  @Get(':immatriculation')
  @ApiOperation({ summary: 'Obtenir un véhicule par immatriculation' })
  @ApiParam({ name: 'immatriculation' })
  async findOne(@Param('immatriculation') immatriculation: string) {
    return { message: 'Véhicule trouvé', data: await this.service.findOne(immatriculation) };
  }

  @Post()
  @Roles(RoleLibelle.ADMINISTRATEUR, RoleLibelle.RESPONSABLE)
  @ApiOperation({ summary: 'Enregistrer un véhicule' })
  async create(@Body() dto: CreateVehiculeDto) {
    return { message: 'Véhicule créé', data: await this.service.create(dto) };
  }

  @Patch(':immatriculation')
  @Roles(RoleLibelle.ADMINISTRATEUR, RoleLibelle.RESPONSABLE)
  @ApiOperation({ summary: 'Mettre à jour un véhicule' })
  @ApiParam({ name: 'immatriculation' })
  async update(@Param('immatriculation') immatriculation: string, @Body() dto: UpdateVehiculeDto) {
    return { message: 'Véhicule mis à jour', data: await this.service.update(immatriculation, dto) };
  }

  @Delete(':immatriculation')
  @Roles(RoleLibelle.ADMINISTRATEUR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer un véhicule' })
  @ApiParam({ name: 'immatriculation' })
  async remove(@Param('immatriculation') immatriculation: string) {
    await this.service.remove(immatriculation);
    return { message: 'Véhicule supprimé', data: null };
  }
}
