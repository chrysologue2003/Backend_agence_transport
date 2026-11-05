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
import { PaiementsService } from './paiements.service.js';
import { CreatePaiementDto } from './dto/create-paiement.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { RoleLibelle } from '../roles/enums/role-libelle.enum.js';

@ApiTags('paiements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('paiements')
export class PaiementsController {
  constructor(private readonly service: PaiementsService) {}

  @Get()
  @ApiOperation({ summary: 'Lister tous les paiements (paginé)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async findAll(@Query('page') page = '1', @Query('limit') limit = '20') {
    return {
      message: 'Liste des paiements',
      data: await this.service.findAll(+page, +limit),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un paiement par son ID' })
  @ApiParam({ name: 'id', description: 'UUID du paiement' })
  async findOne(@Param('id') id: string) {
    return {
      message: 'Paiement trouvé',
      data: await this.service.findOne(id),
    };
  }

  @Post()
  @Roles(
    RoleLibelle.ADMINISTRATEUR,
    RoleLibelle.RESPONSABLE,
    RoleLibelle.COMPTABLE_CAISSIER,
    RoleLibelle.AGENT,
  )
  @ApiOperation({ summary: 'Enregistrer un nouveau paiement' })
  async create(@Body() dto: CreatePaiementDto, @Req() req: any) {
    return {
      message: 'Paiement enregistré avec succès',
      data: await this.service.create(dto, req.user),
    };
  }

  @Delete(':id')
  @Roles(RoleLibelle.ADMINISTRATEUR, RoleLibelle.RESPONSABLE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer un paiement' })
  @ApiParam({ name: 'id', description: 'UUID du paiement' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return {
      message: 'Paiement supprimé',
      data: null,
    };
  }
}
