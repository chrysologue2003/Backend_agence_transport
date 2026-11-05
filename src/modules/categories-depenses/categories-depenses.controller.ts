import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus,
  Param, Patch, Post, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CategoriesDepensesService } from './categories-depenses.service.js';
import { CreateCategorieDepenseDto } from './dto/create-categorie-depense.dto.js';
import { UpdateCategorieDepenseDto } from './dto/update-categorie-depense.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { RoleLibelle } from '../roles/enums/role-libelle.enum.js';

@ApiTags('categories-depenses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('categories-depenses')
export class CategoriesDepensesController {
  constructor(private readonly service: CategoriesDepensesService) {}

  @Get()
  @ApiOperation({ summary: 'Lister toutes les catégories de dépenses' })
  async findAll() {
    return { message: 'Liste des catégories de dépenses', data: await this.service.findAll() };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une catégorie de dépense par ID' })
  @ApiParam({ name: 'id', description: 'UUID de la catégorie' })
  async findOne(@Param('id') id: string) {
    return { message: 'Catégorie trouvée', data: await this.service.findOne(id) };
  }

  @Post()
  @Roles(RoleLibelle.ADMINISTRATEUR, RoleLibelle.RESPONSABLE)
  @ApiOperation({ summary: 'Créer une catégorie de dépense' })
  async create(@Body() dto: CreateCategorieDepenseDto) {
    return { message: 'Catégorie créée', data: await this.service.create(dto) };
  }

  @Patch(':id')
  @Roles(RoleLibelle.ADMINISTRATEUR, RoleLibelle.RESPONSABLE)
  @ApiOperation({ summary: 'Mettre à jour une catégorie de dépense' })
  @ApiParam({ name: 'id', description: 'UUID de la catégorie' })
  async update(@Param('id') id: string, @Body() dto: UpdateCategorieDepenseDto) {
    return { message: 'Catégorie mise à jour', data: await this.service.update(id, dto) };
  }

  @Delete(':id')
  @Roles(RoleLibelle.ADMINISTRATEUR, RoleLibelle.RESPONSABLE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer une catégorie de dépense' })
  @ApiParam({ name: 'id', description: 'UUID de la catégorie' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'Catégorie supprimée', data: null };
  }
}
