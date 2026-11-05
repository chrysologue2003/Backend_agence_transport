import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Activite } from '../../activites/entities/activite.entity.js';
import { User } from '../../users/entities/user.entity.js';
import { ModePaiement } from '../../../common/enums/mode-paiement.enum.js';

@Entity('paiements')
export class Paiement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('idx_paiements_activite_id')
  @Column({ name: 'activite_id', type: 'uuid' })
  activite_id: string;

  @ManyToOne(() => Activite, { eager: false, nullable: false })
  @JoinColumn({ name: 'activite_id', foreignKeyConstraintName: 'fk_paiements_activite_id' })
  activite: Activite;

  @Column({ name: 'date_paiement', type: 'date' })
  date_paiement: Date;

  @Column({ name: 'montant', type: 'decimal', precision: 12, scale: 2 })
  montant: number;

  @Column({ name: 'mode_paiement', type: 'enum', enum: ModePaiement, default: ModePaiement.ESPECES })
  mode_paiement: ModePaiement;

  @Column({ name: 'reference', type: 'varchar', nullable: true })
  reference: string | null;

  @Column({ name: 'created_by_id', type: 'uuid', nullable: true })
  created_by_id: string | null;

  @ManyToOne(() => User, { eager: false, nullable: true })
  @JoinColumn({ name: 'created_by_id', foreignKeyConstraintName: 'fk_paiements_created_by_id' })
  created_by: User | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
