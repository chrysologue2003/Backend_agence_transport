import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { TypeClient } from '../enums/type-client.enum.js';

export class UpdateClientDto {
  @ApiProperty({ required: false }) @IsString() @IsOptional() nom?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() prenom?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Matches(/^((\+261|00261|261)[\s.-]?)?(0?)(32|34|37|38)[\s.-]?\d{2}[\s.-]?\d{2,3}[\s.-]?\d{2,3}$/, {
    message: 'Le numéro de téléphone doit obligatoirement commencer par 034, 032, 037 ou 038',
  })
  telephone?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() adresse?: string;
  @ApiProperty({ required: false }) @IsEmail() @IsOptional() email?: string;
  @ApiProperty({ enum: TypeClient, required: false }) @IsEnum(TypeClient) @IsOptional() type_client?: TypeClient;
  @ApiProperty({ required: false }) @IsString() @IsOptional() observations?: string;
}
