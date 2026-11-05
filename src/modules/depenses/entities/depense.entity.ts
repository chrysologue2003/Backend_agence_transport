import {
  Column, CreateDateColumn, Entity, Index, JoinColumn,
  ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { CategorieDepense } from '../../categories-depenses/entities/categorie-depense.entity.js';
import { Vehicule } from '../../vehicules/entities/vehicule.entity.js';
import { User } from '../../users/entities/user.entity.js';
import { ModePaiement } from '../../../common/enums/mode-paiement.enum.js';

@Entity('depenses')
export class Depense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'date_depense', type: 'date' })
  date_depense: Date;

  @Index('idx_depenses_categorie_id')
  @Column({ name: 'categorie_id', type: 'uuid' })
  categorie_id: string;

  @ManyToOne(() => CategorieDepense, { eager: false, nullable: false })
  @JoinColumn({ name: 'categorie_id', foreignKeyConstraintName: 'fk_depenses_categorie_id' })
  categorie: CategorieDepense;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'montant', type: 'decimal', precision: 12, scale: 2 })
  montant: number;

  @Column({ name: 'immatriculation', type: 'varchar', nullable: true })
  immatriculation: string | null;

  @ManyToOne(() => Vehicule, { eager: false, nullable: true })
  @JoinColumn({ name: 'immatriculation', foreignKeyConstraintName: 'fk_depenses_immatriculation' })
  vehicule: Vehicule | null;

  @Column({ name: 'fournisseur', type: 'varchar', nullable: true })
  fournisseur: string | null;

  @Column({ name: 'mode_paiement', type: 'enum', enum: ModePaiement, nullable: true })
  mode_paiement: ModePaiement | null;

  @Column({ name: 'reference', type: 'varchar', nullable: true })
  reference: string | null;

  @Column({ name: 'justificatif', type: 'varchar', nullable: true })
  justificatif: string | null;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  user_id: string | null;

  @ManyToOne(() => User, { eager: false, nullable: true })
  @JoinColumn({ name: 'user_id', foreignKeyConstraintName: 'fk_depenses_user_id' })
  user: User | null;

  @Column({ name: 'created_by_id', type: 'uuid', nullable: true })
  created_by_id: string | null;

  @ManyToOne(() => User, { eager: false, nullable: true })
  @JoinColumn({ name: 'created_by_id', foreignKeyConstraintName: 'fk_depenses_created_by_id' })
  created_by: User | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
