import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { StatutChauffeur } from '../enums/statut-chauffeur.enum.js';

export class CreateChauffeurDto {
  @ApiProperty({ example: 'CH-001', description: 'Matricule (clé primaire)' })
  @IsString() @IsNotEmpty()
  matricule: string;

  @ApiProperty({ example: 'Rasoa' }) @IsString() @IsNotEmpty()
  nom: string;

  @ApiProperty({ required: false }) @IsString() @IsOptional()
  prenom?: string;

  @ApiProperty({ example: '0320000000', description: 'Téléphone (obligatoire, commence par 034, 032, 037 ou 038)' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^((\+261|00261|261)[\s.-]?)?(0?)(32|34|37|38)[\s.-]?\d{2}[\s.-]?\d{2,3}[\s.-]?\d{2,3}$/, {
    message: 'Le numéro de téléphone doit obligatoirement commencer par 034, 032, 037 ou 038',
  })
  telephone: string;

  @ApiProperty({ required: false }) @IsString() @IsOptional()
  adresse?: string;

  @ApiProperty({ example: 'P-123456', description: 'Numéro de permis' })
  @IsString() @IsNotEmpty()
  numero_permis: string;

  @ApiProperty({ example: 'B', required: false }) @IsString() @IsOptional()
  categorie_permis?: string;

  @ApiProperty({ example: '2026-12-31', required: false })
  @IsDateString() @IsOptional()
  date_expiration_permis?: string;

  @ApiProperty({ example: '2022-01-01', required: false })
  @IsDateString() @IsOptional()
  date_embauche?: string;

  @ApiProperty({ enum: StatutChauffeur, default: StatutChauffeur.DISPONIBLE, required: false })
  @IsEnum(StatutChauffeur) @IsOptional()
  statut?: StatutChauffeur;
}
