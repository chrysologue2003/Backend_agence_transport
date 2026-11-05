import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { RoleLibelle } from '../../roles/enums/role-libelle.enum.js';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  nom_utilisateur?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  login?: string;

  @ApiProperty({ required: false, minLength: 6 })
  @IsString()
  @IsOptional()
  @MinLength(6)
  mot_de_passe?: string;

  @ApiProperty({ enum: RoleLibelle, required: false })
  @IsEnum(RoleLibelle)
  @IsOptional()
  role?: RoleLibelle;
}
