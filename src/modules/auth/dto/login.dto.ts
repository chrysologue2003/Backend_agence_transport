import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin', description: 'Identifiant de connexion' })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({ example: 'admin', description: 'Mot de passe' })
  @IsString()
  @IsNotEmpty()
  mot_de_passe: string;
}
