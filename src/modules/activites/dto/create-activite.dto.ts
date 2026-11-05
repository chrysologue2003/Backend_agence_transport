import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { StatutActivite } from '../enums/statut-activite.enum.js';

export class CreateActiviteDto {
  @ApiProperty({ example: 'uuid-client', description: 'ID du client' })
  @IsString()
  @IsNotEmpty()
  client_id: string;

  @ApiProperty({ example: 'ABC-1234', description: 'Immatriculation du véhicule', required: false })
  @IsString()
  @IsOptional()
  immatriculation?: string;

  @ApiProperty({ example: 'CH-001', description: 'Matricule du chauffeur', required: false })
  @IsString()
  @IsOptional()
  matricule_chauffeur?: string;

  @ApiProperty({ example: 'LOC', description: 'Code du type de prestation' })
  @IsString()
  @IsNotEmpty()
  type_prestation_code: string;

  @ApiProperty({ example: '2026-08-28', description: "Date de l'activité" })
  @IsDateString()
  @IsNotEmpty()
  date_activite: string;

  @ApiProperty({ example: 'Toamasina', description: 'Destination', required: false })
  @IsString()
  @IsOptional()
  destination?: string;

  @ApiProperty({ example: 150000.5, description: 'Prix total' })
  @IsNumber()
  @Min(0)
  prix: number;

  @ApiProperty({ example: 50000, description: 'Montant versé à l\'avance', required: false, default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  avance?: number;

  @ApiProperty({ enum: StatutActivite, example: StatutActivite.EN_ATTENTE, required: false })
  @IsEnum(StatutActivite)
  @IsOptional()
  statut?: StatutActivite;

  @ApiProperty({ example: 'Trajet longue distance', required: false })
  @IsString()
  @IsOptional()
  observations?: string;
}
