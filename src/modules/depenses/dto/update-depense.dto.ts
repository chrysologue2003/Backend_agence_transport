import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ModePaiement } from '../../../common/enums/mode-paiement.enum.js';

export class UpdateDepenseDto {
  @ApiProperty({ required: false }) @IsDateString() @IsOptional() date_depense?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() categorie_id?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() description?: string;
  @ApiProperty({ required: false }) @IsNumber() @Min(0.01) @IsOptional() montant?: number;
  @ApiProperty({ required: false }) @IsString() @IsOptional() immatriculation?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() fournisseur?: string;
  @ApiProperty({ enum: ModePaiement, required: false }) @IsEnum(ModePaiement) @IsOptional() mode_paiement?: ModePaiement;
  @ApiProperty({ required: false }) @IsString() @IsOptional() reference?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() justificatif?: string;
}
