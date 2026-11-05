import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'nom_utilisateur', type: 'varchar' })
  nom_utilisateur: string;

  @Index('idx_users_login')
  @Column({ unique: true, name: 'login', type: 'varchar' })
  login: string;

  @Column({ name: 'mot_de_passe', type: 'varchar' })
  mot_de_passe: string;

  @Column({ name: 'role_id', type: 'uuid', nullable: true })
  role_id: string;

  @ManyToOne(() => Role, (role) => role.users, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({
    name: 'role_id',
    foreignKeyConstraintName: 'fk_users_role_id',
  })
  role: Role;
}
