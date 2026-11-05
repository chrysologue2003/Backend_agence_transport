import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { UserPayload } from './interfaces/user-payload.interface.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; user: Partial<User> }> {
    const user = await this.userRepository.findOne({
      where: { login: loginDto.login },
      relations: { role: true },
    });

    if (!user) {
      throw new NotFoundException(
        `Utilisateur "${loginDto.login}" introuvable`,
      );
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.mot_de_passe,
      user.mot_de_passe,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Mot de passe incorrect');
    }

    const payload: UserPayload = {
      sub: user.id,
      login: user.login,
      role: user.role?.libelle,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: {
        id: user.id,
        nom_utilisateur: user.nom_utilisateur,
        login: user.login,
        role: user.role,
      },
    };
  }

  async register(
    registerDto: RegisterDto,
  ): Promise<{ access_token: string; user: Partial<User> }> {
    const created = await this.usersService.create({
      nom_utilisateur: registerDto.nom_utilisateur,
      login: registerDto.login,
      mot_de_passe: registerDto.mot_de_passe,
      role: registerDto.role,
    });

    const user = await this.userRepository.findOne({
      where: { id: created.id },
      relations: { role: true },
    });

    const payload: UserPayload = {
      sub: user!.id,
      login: user!.login,
      role: user!.role?.libelle,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: {
        id: user!.id,
        nom_utilisateur: user!.nom_utilisateur,
        login: user!.login,
        role: user!.role,
      },
    };
  }
}
