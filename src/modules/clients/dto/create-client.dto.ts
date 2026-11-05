import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { TypeClient } from '../enums/type-client.enum.js';

export class CreateClientDto {
  @ApiProperty({ example: 'Rakoto', description: 'Nom du client (obligatoire)' })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({ example: 'Jean', required: false })
  @IsString()
  @IsOptional()
  prenom?: string;

  @ApiProperty({ example: '0340000000', description: 'Téléphone (obligatoire, commence par 034, 032, 037 ou 038)' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^((\+261|00261|261)[\s.-]?)?(0?)(32|34|37|38)[\s.-]?\d{2}[\s.-]?\d{2,3}[\s.-]?\d{2,3}$/, {
    message: 'Le numéro de téléphone doit obligatoirement commencer par 034, 032, 037 ou 038',
  })
  telephone: string;

  @ApiProperty({ example: 'Lot II A 47 Antananarivo', required: false })
  @IsString()
  @IsOptional()
  adresse?: string;

  @ApiProperty({ example: 'rakoto@mail.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ enum: TypeClient, example: TypeClient.PARTICULIER, required: false })
  @IsEnum(TypeClient)
  @IsOptional()
  type_client?: TypeClient;

  @ApiProperty({ example: 'Client fidèle', required: false })
  @IsString()
  @IsOptional()
  observations?: string;
}
