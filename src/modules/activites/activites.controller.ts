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
import { ActivitesService } from './activites.service.js';
import { CreateActiviteDto } from './dto/create-activite.dto.js';
import { UpdateActiviteDto } from './dto/update-activite.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { RoleLibelle } from '../roles/enums/role-libelle.enum.js';

@ApiTags('activites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('activites')
export class ActivitesController {
  constructor(private readonly service: ActivitesService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les activités (paginé)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async findAll(@Query('page') page = '1', @Query('limit') limit = '20') {
    return {
      message: 'Liste des activités',
      data: await this.service.findAll(+page, +limit),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une activité par son ID' })
  @ApiParam({ name: 'id', description: 'UUID de l\'activité' })
  async findOne(@Param('id') id: string) {
    return {
      message: 'Activité trouvée',
      data: await this.service.findOne(id),
    };
  }

  @Post()
  @Roles(RoleLibelle.ADMINISTRATEUR, RoleLibelle.RESPONSABLE, RoleLibelle.AGENT)
  @ApiOperation({ summary: 'Créer une nouvelle activité' })
  async create(@Body() dto: CreateActiviteDto, @Req() req: any) {
    return {
      message: 'Activité créée avec succès',
      data: await this.service.create(dto, req.user),
    };
  }

  @Patch(':id')
  @Roles(RoleLibelle.ADMINISTRATEUR, RoleLibelle.RESPONSABLE, RoleLibelle.AGENT)
  @ApiOperation({ summary: 'Mettre à jour une activité' })
  @ApiParam({ name: 'id', description: 'UUID de l\'activité' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateActiviteDto,
    @Req() req: any,
  ) {
    return {
      message: 'Activité mise à jour',
      data: await this.service.update(id, dto, req.user),
    };
  }

  @Delete(':id')
  @Roles(RoleLibelle.ADMINISTRATEUR, RoleLibelle.RESPONSABLE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer une activité' })
  @ApiParam({ name: 'id', description: 'UUID de l\'activité' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return {
      message: 'Activité supprimée avec succès',
      data: null,
    };
  }
}
