import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategorieDepenseDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  libelle?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  famille?: string;
}
