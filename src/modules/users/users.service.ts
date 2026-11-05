import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity.js';
import { Role } from '../roles/entities/role.entity.js';
import { RoleLibelle } from '../roles/enums/role-libelle.enum.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

const BCRYPT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: { role: true } });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { role: true },
    });
    if (!user) throw new NotFoundException(`Utilisateur #${id} introuvable`);
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findOne({
      where: { login: createUserDto.login },
    });
    if (existing) {
      throw new ConflictException(
        `Le login "${createUserDto.login}" est déjà utilisé`,
      );
    }

    const hashed = await bcrypt.hash(createUserDto.mot_de_passe, BCRYPT_ROUNDS);

    let role: Role | undefined;
    if (createUserDto.role) {
      const foundRole = await this.roleRepository.findOne({
        where: { libelle: createUserDto.role as RoleLibelle },
      });
      if (foundRole) role = foundRole;
    }

    const user = this.userRepository.create({
      nom_utilisateur: createUserDto.nom_utilisateur,
      login: createUserDto.login,
      mot_de_passe: hashed,
      role,
    });

    return this.userRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.login && updateUserDto.login !== user.login) {
      const existing = await this.userRepository.findOne({
        where: { login: updateUserDto.login },
      });
      if (existing) {
        throw new ConflictException(
          `Le login "${updateUserDto.login}" est déjà utilisé`,
        );
      }
      user.login = updateUserDto.login;
    }

    if (updateUserDto.nom_utilisateur) {
      user.nom_utilisateur = updateUserDto.nom_utilisateur;
    }

    if (updateUserDto.mot_de_passe) {
      user.mot_de_passe = await bcrypt.hash(
        updateUserDto.mot_de_passe,
        BCRYPT_ROUNDS,
      );
    }

    if (updateUserDto.role) {
      const role = await this.roleRepository.findOne({
        where: { libelle: updateUserDto.role as RoleLibelle },
      });
      if (role) user.role = role;
    }

    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
