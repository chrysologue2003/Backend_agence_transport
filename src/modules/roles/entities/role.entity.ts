import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoleLibelle } from '../enums/role-libelle.enum.js';
import { User } from '../../users/entities/user.entity.js';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: RoleLibelle,
    unique: true,
    name: 'libelle',
  })
  libelle: RoleLibelle;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
