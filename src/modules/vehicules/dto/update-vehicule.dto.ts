import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { StatutVehicule } from '../enums/statut-vehicule.enum.js';

export class UpdateVehiculeDto {
  @ApiProperty({ required: false }) @IsString() @IsOptional() marque?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() modele?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() type_vehicule?: string;
  @ApiProperty({ required: false }) @IsNumber() @IsOptional() capacite?: number;
  @ApiProperty({ required: false }) @IsNumber() @IsOptional() annee_mise_circulation?: number;
  @ApiProperty({ required: false }) @IsDateString() @IsOptional() date_acquisition?: string;
  @ApiProperty({ required: false }) @IsNumber() @IsOptional() kilometrage?: number;
  @ApiProperty({ required: false }) @IsString() @IsOptional() etat?: string;
  @ApiProperty({ enum: StatutVehicule, required: false }) @IsEnum(StatutVehicule) @IsOptional() statut?: StatutVehicule;
  @ApiProperty({ required: false }) @IsDateString() @IsOptional() date_assurance?: string;
  @ApiProperty({ required: false }) @IsDateString() @IsOptional() date_expiration_assurance?: string;
  @ApiProperty({ required: false }) @IsDateString() @IsOptional() date_visite_technique?: string;
  @ApiProperty({ required: false }) @IsDateString() @IsOptional() date_prochaine_maintenance?: string;
}
