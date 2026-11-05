import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { StatutActivite } from '../enums/statut-activite.enum.js';

export class UpdateActiviteDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  client_id?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  immatriculation?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  matricule_chauffeur?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  type_prestation_code?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  date_activite?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  destination?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  prix?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  avance?: number;

  @ApiProperty({ enum: StatutActivite, required: false })
  @IsEnum(StatutActivite)
  @IsOptional()
  statut?: StatutActivite;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  observations?: string;
}
