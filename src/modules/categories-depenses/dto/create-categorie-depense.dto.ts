import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategorieDepenseDto {
  @ApiProperty({ example: 'Carburant', description: 'Libellé de la catégorie' })
  @IsString()
  @IsNotEmpty()
  libelle: string;

  @ApiProperty({ example: 'Exploitation', description: 'Famille de la catégorie', required: false })
  @IsString()
  @IsOptional()
  famille?: string;
}
