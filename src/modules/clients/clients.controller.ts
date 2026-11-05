import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus,
  Param, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ClientsService } from './clients.service.js';
import { CreateClientDto } from './dto/create-client.dto.js';
import { UpdateClientDto } from './dto/update-client.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { RoleLibelle } from '../roles/enums/role-libelle.enum.js';

@ApiTags('clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly service: ClientsService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les clients (paginé, filtrable)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'sort', required: false, example: 'date_creation' })
  @ApiQuery({ name: 'search', required: false, description: 'Recherche par nom ou téléphone' })
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('sort') sort = 'date_creation',
    @Query('search') search?: string,
  ) {
    const result = await this.service.findAll(+page, +limit, sort, search);
    return { message: 'Liste des clients', data: result };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un client par son ID' })
  @ApiParam({ name: 'id', description: 'UUID du client' })
  async findOne(@Param('id') id: string) {
    return { message: 'Client trouvé', data: await this.service.findOne(id) };
  }

  @Post()
  @Roles(RoleLibelle.ADMINISTRATEUR, RoleLibelle.RESPONSABLE, RoleLibelle.AGENT)
  @ApiOperation({ summary: 'Créer un nouveau client' })
  async create(@Body() dto: CreateClientDto) {
    return { message: 'Client créé', data: await this.service.create(dto) };
  }

  @Patch(':id')
  @Roles(RoleLibelle.ADMINISTRATEUR, RoleLibelle.RESPONSABLE, RoleLibelle.AGENT)
  @ApiOperation({ summary: 'Mettre à jour un client' })
  @ApiParam({ name: 'id', description: 'UUID du client' })
  async update(@Param('id') id: string, @Body() dto: UpdateClientDto) {
    return { message: 'Client mis à jour', data: await this.service.update(id, dto) };
  }

  @Delete(':id')
  @Roles(RoleLibelle.ADMINISTRATEUR, RoleLibelle.RESPONSABLE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer un client' })
  @ApiParam({ name: 'id', description: 'UUID du client' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'Client supprimé', data: null };
  }
}
