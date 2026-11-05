import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { DepensesService } from './depenses.service.js';
import { CreateDepenseDto } from './dto/create-depense.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { RoleLibelle } from '../roles/enums/role-libelle.enum.js';

@ApiTags('depenses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('depenses')
export class DepensesController {
  constructor(private readonly service: DepensesService) {}

  @Get()
  @Roles(RoleLibelle.ADMINISTRATEUR, RoleLibelle.RESPONSABLE, RoleLibelle.COMPTABLE_CAISSIER)
  @ApiOperation({ summary: 'Lister toutes les dépenses (paginé)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async findAll(@Query('page') page = '1', @Query('limit') limit = '20') {
    return {
      message: 'Liste des dépenses',
      data: await this.service.findAll(+page, +limit),
    };
  }

  @Get(':id')
  @Roles(RoleLibelle.ADMINISTRATEUR, RoleLibelle.RESPONSABLE, RoleLibelle.COMPTABLE_CAISSIER)
  @ApiOperation({ summary: 'Obtenir une dépense par son ID' })
  @ApiParam({ name: 'id', description: 'UUID de la dépense' })
  async findOne(@Param('id') id: string) {
    return {
      message: 'Dépense trouvée',
      data: await this.service.findOne(id),
    };
  }

  @Post()
  @Roles(RoleLibelle.ADMINISTRATEUR, RoleLibelle.RESPONSABLE, RoleLibelle.COMPTABLE_CAISSIER)
  @ApiOperation({ summary: 'Enregistrer une nouvelle dépense' })
  async create(@Body() dto: CreateDepenseDto, @Req() req: any) {
    return {
      message: 'Dépense enregistrée avec succès',
      data: await this.service.create(dto, req.user),
    };
  }

  @Delete(':id')
  @Roles(RoleLibelle.ADMINISTRATEUR, RoleLibelle.RESPONSABLE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer une dépense' })
  @ApiParam({ name: 'id', description: 'UUID de la dépense' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return {
      message: 'Dépense supprimée',
      data: null,
    };
  }
}
