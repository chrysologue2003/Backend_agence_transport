import {
  Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { Paiement } from '../../paiements/entities/paiement.entity.js';
import { User } from '../../users/entities/user.entity.js';

@Entity('recettes')
export class Recette {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'paiement_id', type: 'uuid', nullable: true })
  paiement_id: string | null;

  @ManyToOne(() => Paiement, { eager: false, nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'paiement_id', foreignKeyConstraintName: 'fk_recettes_paiement_id' })
  paiement: Paiement | null;

  @Column({ name: 'date_recette', type: 'date' })
  date_recette: Date;

  @Column({ name: 'type_prestation', type: 'varchar', nullable: true })
  type_prestation: string | null;

  @Column({ name: 'montant', type: 'decimal', precision: 12, scale: 2 })
  montant: number;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  user_id: string | null;

  @ManyToOne(() => User, { eager: false, nullable: true })
  @JoinColumn({ name: 'user_id', foreignKeyConstraintName: 'fk_recettes_user_id' })
  user: User | null;
}
