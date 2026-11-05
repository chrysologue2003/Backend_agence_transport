import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../modules/roles/entities/role.entity.js';
import { User } from '../modules/users/entities/user.entity.js';
import { RoleLibelle } from '../modules/roles/enums/role-libelle.enum.js';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.seedRoles();
    await this.seedAdminUser();
  }

  private async seedRoles(): Promise<void> {
    const roleValues = Object.values(RoleLibelle);
    for (const libelle of roleValues) {
      const existing = await this.roleRepository.findOne({
        where: { libelle },
      });
      if (!existing) {
        await this.roleRepository.save(
          this.roleRepository.create({ libelle }),
        );
        this.logger.log(`Rôle "${libelle}" créé`);
      }
    }
  }

  private async seedAdminUser(): Promise<void> {
    const existing = await this.userRepository.findOne({
      where: { login: 'admin' },
    });

    if (existing) return;

    const adminRole = await this.roleRepository.findOne({
      where: { libelle: RoleLibelle.ADMINISTRATEUR },
    });

    const hashed = await bcrypt.hash('admin', 10);
    await this.userRepository.save(
      this.userRepository.create({
        nom_utilisateur: 'Administrateur',
        login: 'admin',
        mot_de_passe: hashed,
        role: adminRole ?? undefined,
      }),
    );

    this.logger.log('Utilisateur administrateur créé (admin / admin)');
  }
}
