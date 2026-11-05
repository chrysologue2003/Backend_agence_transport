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
import { ModePaiement } from '../../../common/enums/mode-paiement.enum.js';

export class CreatePaiementDto {
  @ApiProperty({ example: 'uuid-activite', description: 'ID de l\'activité liée' })
  @IsString()
  @IsNotEmpty()
  activite_id: string;

  @ApiProperty({ example: '2026-08-28', description: 'Date de paiement' })
  @IsDateString()
  @IsNotEmpty()
  date_paiement: string;

  @ApiProperty({ example: 10000, description: 'Montant payé' })
  @IsNumber()
  @Min(0.01)
  montant: number;

  @ApiProperty({ enum: ModePaiement, example: ModePaiement.MOBILE_MONEY })
  @IsEnum(ModePaiement)
  @IsNotEmpty()
  mode_paiement: ModePaiement;

  @ApiProperty({ example: 'REF-TX-892', required: false, description: 'Référence transaction' })
  @IsString()
  @IsOptional()
  reference?: string;
}
