import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTypePrestationDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  libelle?: string;
}
