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

export class CreateDepenseDto {
  @ApiProperty({ example: '2026-08-28', description: 'Date de la dépense' })
  @IsDateString()
  @IsNotEmpty()
  date_depense: string;

  @ApiProperty({ example: 'uuid-categorie', description: 'ID de la catégorie de dépense' })
  @IsString()
  @IsNotEmpty()
  categorie_id: string;

  @ApiProperty({ example: 'Achat de carburant', description: 'Description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 45000, description: 'Montant de la dépense' })
  @IsNumber()
  @Min(0.01)
  montant: number;

  @ApiProperty({ example: 'ABC-1234', required: false, description: 'Immatriculation du véhicule concerné' })
  @IsString()
  @IsOptional()
  immatriculation?: string;

  @ApiProperty({ example: 'Station TOTAL', required: false })
  @IsString()
  @IsOptional()
  fournisseur?: string;

  @ApiProperty({ enum: ModePaiement, example: ModePaiement.ESPECES, required: false })
  @IsEnum(ModePaiement)
  @IsOptional()
  mode_paiement?: ModePaiement;

  @ApiProperty({ example: 'FACT-9081', required: false })
  @IsString()
  @IsOptional()
  reference?: string;

  @ApiProperty({ example: 'justificatifs/facture_123.pdf', required: false, description: 'Chemin du fichier justificatif' })
  @IsString()
  @IsOptional()
  justificatif?: string;
}
