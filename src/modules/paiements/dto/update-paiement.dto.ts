import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ModePaiement } from '../../../common/enums/mode-paiement.enum.js';

export class UpdatePaiementDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  activite_id?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  date_paiement?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0.01)
  @IsOptional()
  montant?: number;

  @ApiProperty({ enum: ModePaiement, required: false })
  @IsEnum(ModePaiement)
  @IsOptional()
  mode_paiement?: ModePaiement;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  reference?: string;
}
