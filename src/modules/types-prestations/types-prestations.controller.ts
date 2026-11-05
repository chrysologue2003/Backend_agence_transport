import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { TypesPrestationsService } from './types-prestations.service.js';
import { CreateTypePrestationDto } from './dto/create-type-prestation.dto.js';
import { UpdateTypePrestationDto } from './dto/update-type-prestation.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { RoleLibelle } from '../roles/enums/role-libelle.enum.js';

@ApiTags('types-prestations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('types-prestations')
export class TypesPrestationsController {
  constructor(private readonly service: TypesPrestationsService) {}

  @Get()
  @ApiOperation({ summary: 'Lister tous les types de prestations' })
  async findAll() {
    return { message: 'Liste des types de prestations', data: await this.service.findAll() };
  }

  @Get(':code')
  @ApiOperation({ summary: 'Obtenir un type de prestation par son code' })
  @ApiParam({ name: 'code', description: 'Code du type de prestation (ex: LOC)' })
  async findOne(@Param('code') code: string) {
    return { message: 'Type de prestation trouvé', data: await this.service.findOne(code) };
  }

  @Post()
  @Roles(RoleLibelle.ADMINISTRATEUR, RoleLibelle.RESPONSABLE)
  @ApiOperation({ summary: 'Créer un nouveau type de prestation' })
  async create(@Body() dto: CreateTypePrestationDto) {
    return { message: 'Type de prestation créé', data: await this.service.create(dto) };
  }

  @Patch(':code')
  @Roles(RoleLibelle.ADMINISTRATEUR, RoleLibelle.RESPONSABLE)
  @ApiOperation({ summary: 'Mettre à jour un type de prestation' })
  @ApiParam({ name: 'code', description: 'Code du type de prestation' })
  async update(@Param('code') code: string, @Body() dto: UpdateTypePrestationDto) {
    return { message: 'Type de prestation mis à jour', data: await this.service.update(code, dto) };
  }

  @Delete(':code')
  @Roles(RoleLibelle.ADMINISTRATEUR, RoleLibelle.RESPONSABLE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer un type de prestation' })
  @ApiParam({ name: 'code', description: 'Code du type de prestation' })
  async remove(@Param('code') code: string) {
    await this.service.remove(code);
    return { message: 'Type de prestation supprimé', data: null };
  }
}
