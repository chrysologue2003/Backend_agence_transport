import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateTypePrestationDto {
  @ApiProperty({
    example: 'LOC',
    description: 'Code unique du type de prestation (ex: LOC, TRM, AUT)',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{2,10}$/, {
    message: 'Le code doit être en majuscules, entre 2 et 10 caractères',
  })
  code: string;

  @ApiProperty({
    example: 'Location de véhicule',
    description: 'Libellé du type de prestation',
  })
  @IsString()
  @IsNotEmpty()
  libelle: string;
}
