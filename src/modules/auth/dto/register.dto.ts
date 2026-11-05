import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { RoleLibelle } from '../../roles/enums/role-libelle.enum.js';

export class RegisterDto {
  @ApiProperty({ example: 'Chrysologue Rakoto', description: "Nom complet de l'utilisateur" })
  @IsString()
  @IsNotEmpty({ message: 'Le nom d\'utilisateur est requis' })
  nom_utilisateur: string;

  @ApiProperty({ example: 'admin2', description: 'Identifiant de connexion unique' })
  @IsString()
  @IsNotEmpty({ message: 'Le login est requis' })
  login: string;

  @ApiProperty({ example: 'secret123', description: 'Mot de passe sécurisé (minimum 6 caractères)' })
  @IsString()
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(6, { message: 'Le mot de passe doit comporter au moins 6 caractères' })
  mot_de_passe: string;

  @ApiProperty({
    enum: RoleLibelle,
    example: RoleLibelle.ADMINISTRATEUR,
    description: 'Rôle attribué au compte',
    required: false,
    default: RoleLibelle.ADMINISTRATEUR,
  })
  @IsEnum(RoleLibelle, { message: 'Rôle invalide' })
  @IsOptional()
  role?: RoleLibelle = RoleLibelle.ADMINISTRATEUR;
}
