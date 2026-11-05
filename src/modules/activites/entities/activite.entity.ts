import {
  Column, CreateDateColumn, Entity, Index, JoinColumn,
  ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from '../../clients/entities/client.entity.js';
import { Vehicule } from '../../vehicules/entities/vehicule.entity.js';
import { Chauffeur } from '../../chauffeurs/entities/chauffeur.entity.js';
import { TypePrestation } from '../../types-prestations/entities/type-prestation.entity.js';
import { User } from '../../users/entities/user.entity.js';
import { StatutActivite } from '../enums/statut-activite.enum.js';

@Entity('activites')
export class Activite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('idx_activites_client_id')
  @Column({ name: 'client_id', type: 'uuid' })
  client_id: string;

  @ManyToOne(() => Client, { eager: false, nullable: false })
  @JoinColumn({ name: 'client_id', foreignKeyConstraintName: 'fk_activites_client_id' })
  client: Client;

  @Column({ name: 'immatriculation', type: 'varchar', nullable: true })
  immatriculation: string | null;

  @ManyToOne(() => Vehicule, { eager: false, nullable: true })
  @JoinColumn({ name: 'immatriculation', foreignKeyConstraintName: 'fk_activites_immatriculation' })
  vehicule: Vehicule | null;

  @Column({ name: 'matricule_chauffeur', type: 'varchar', nullable: true })
  matricule_chauffeur: string | null;

  @ManyToOne(() => Chauffeur, { eager: false, nullable: true })
  @JoinColumn({ name: 'matricule_chauffeur', foreignKeyConstraintName: 'fk_activites_matricule_chauffeur' })
  chauffeur: Chauffeur | null;

  @Column({ name: 'type_prestation_code', type: 'varchar', nullable: true })
  type_prestation_code: string | null;

  @ManyToOne(() => TypePrestation, { eager: false, nullable: true })
  @JoinColumn({ name: 'type_prestation_code', foreignKeyConstraintName: 'fk_activites_type_prestation_code' })
  type_prestation: TypePrestation | null;

  @Column({ name: 'date_activite', type: 'date' })
  date_activite: Date;

  @Column({ name: 'destination', type: 'varchar', nullable: true })
  destination: string | null;

  @Column({ name: 'prix', type: 'decimal', precision: 12, scale: 2 })
  prix: number;

  @Column({ name: 'avance', type: 'decimal', precision: 12, scale: 2, default: 0 })
  avance: number;

  @Column({ name: 'reste_a_payer', type: 'decimal', precision: 12, scale: 2, default: 0 })
  reste_a_payer: number;

  @Column({ name: 'statut', type: 'enum', enum: StatutActivite, default: StatutActivite.EN_ATTENTE })
  statut: StatutActivite;

  @Column({ name: 'observations', type: 'text', nullable: true })
  observations: string | null;

  @Column({ name: 'created_by_id', type: 'uuid', nullable: true })
  created_by_id: string | null;

  @ManyToOne(() => User, { eager: false, nullable: true })
  @JoinColumn({ name: 'created_by_id', foreignKeyConstraintName: 'fk_activites_created_by_id' })
  created_by: User | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
