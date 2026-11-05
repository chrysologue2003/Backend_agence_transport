import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { RoleLibelle } from '../../roles/enums/role-libelle.enum.js';

export class CreateUserDto {
  @ApiProperty({ example: 'Jean Dupont', description: "Nom d'affichage de l'utilisateur" })
  @IsString()
  @IsNotEmpty()
  nom_utilisateur: string;

  @ApiProperty({ example: 'jdupont', description: 'Identifiant de connexion unique' })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({ example: 'motdepasse123', description: 'Mot de passe (min 6 caractères)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  mot_de_passe: string;

  @ApiProperty({
    enum: RoleLibelle,
    example: RoleLibelle.AGENT,
    description: "Libellé du rôle à affecter à l'utilisateur",
    required: false,
  })
  @IsEnum(RoleLibelle)
  @IsOptional()
  role?: RoleLibelle;
}
