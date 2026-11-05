import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString,
} from 'class-validator';
import { StatutVehicule } from '../enums/statut-vehicule.enum.js';

export class CreateVehiculeDto {
  @ApiProperty({ example: 'ABC-1234', description: 'Immatriculation (clé primaire)' })
  @IsString() @IsNotEmpty()
  immatriculation: string;

  @ApiProperty({ example: 'Toyota' })
  @IsString() @IsNotEmpty()
  marque: string;

  @ApiProperty({ example: 'Hilux' })
  @IsString() @IsNotEmpty()
  modele: string;

  @ApiProperty({ example: 'Camion', required: false })
  @IsString() @IsOptional()
  type_vehicule?: string;

  @ApiProperty({ example: 5, description: 'Capacité en tonnes ou places' })
  @IsNumber() @IsNotEmpty()
  capacite: number;

  @ApiProperty({ example: 2020, required: false })
  @IsNumber() @IsOptional()
  annee_mise_circulation?: number;

  @ApiProperty({ example: '2020-01-15', required: false })
  @IsDateString() @IsOptional()
  date_acquisition?: string;

  @ApiProperty({ example: 50000, required: false })
  @IsNumber() @IsOptional()
  kilometrage?: number;

  @ApiProperty({ example: 'Bon état', required: false })
  @IsString() @IsOptional()
  etat?: string;

  @ApiProperty({ enum: StatutVehicule, default: StatutVehicule.DISPONIBLE, required: false })
  @IsEnum(StatutVehicule) @IsOptional()
  statut?: StatutVehicule;

  @ApiProperty({ example: '2024-01-01', required: false })
  @IsDateString() @IsOptional()
  date_assurance?: string;

  @ApiProperty({ example: '2025-01-01', required: false })
  @IsDateString() @IsOptional()
  date_expiration_assurance?: string;

  @ApiProperty({ example: '2024-06-01', required: false })
  @IsDateString() @IsOptional()
  date_visite_technique?: string;

  @ApiProperty({ example: '2025-03-01', required: false })
  @IsDateString() @IsOptional()
  date_prochaine_maintenance?: string;
}
