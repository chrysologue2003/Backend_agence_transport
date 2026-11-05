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
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { RoleLibelle } from '../roles/enums/role-libelle.enum.js';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(RoleLibelle.ADMINISTRATEUR)
  @ApiOperation({ summary: 'Lister tous les utilisateurs' })
  async findAll() {
    const data = await this.usersService.findAll();
    return { message: 'Liste des utilisateurs', data };
  }

  @Get(':id')
  @Roles(RoleLibelle.ADMINISTRATEUR)
  @ApiOperation({ summary: 'Obtenir un utilisateur par son ID' })
  @ApiParam({ name: 'id', description: "UUID de l'utilisateur" })
  async findOne(@Param('id') id: string) {
    const data = await this.usersService.findOne(id);
    return { message: 'Utilisateur trouvé', data };
  }

  @Post()
  @Roles(RoleLibelle.ADMINISTRATEUR)
  @ApiOperation({ summary: 'Créer un nouvel utilisateur' })
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.usersService.create(createUserDto);
    return { message: 'Utilisateur créé avec succès', data };
  }

  @Patch(':id')
  @Roles(RoleLibelle.ADMINISTRATEUR)
  @ApiOperation({ summary: 'Mettre à jour un utilisateur' })
  @ApiParam({ name: 'id', description: "UUID de l'utilisateur" })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const data = await this.usersService.update(id, updateUserDto);
    return { message: 'Utilisateur mis à jour', data };
  }

  @Delete(':id')
  @Roles(RoleLibelle.ADMINISTRATEUR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer un utilisateur' })
  @ApiParam({ name: 'id', description: "UUID de l'utilisateur" })
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return { message: 'Utilisateur supprimé avec succès', data: null };
  }
}
