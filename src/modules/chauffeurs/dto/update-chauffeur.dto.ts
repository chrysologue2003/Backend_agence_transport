import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { StatutChauffeur } from '../enums/statut-chauffeur.enum.js';

export class UpdateChauffeurDto {
  @ApiProperty({ required: false }) @IsString() @IsOptional() nom?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() prenom?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Matches(/^((\+261|00261|261)[\s.-]?)?(0?)(32|34|37|38)[\s.-]?\d{2}[\s.-]?\d{2,3}[\s.-]?\d{2,3}$/, {
    message: 'Le numéro de téléphone doit obligatoirement commencer par 034, 032, 037 ou 038',
  })
  telephone?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() adresse?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() numero_permis?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() categorie_permis?: string;
  @ApiProperty({ required: false }) @IsDateString() @IsOptional() date_expiration_permis?: string;
  @ApiProperty({ required: false }) @IsDateString() @IsOptional() date_embauche?: string;
  @ApiProperty({ enum: StatutChauffeur, required: false }) @IsEnum(StatutChauffeur) @IsOptional() statut?: StatutChauffeur;
}
