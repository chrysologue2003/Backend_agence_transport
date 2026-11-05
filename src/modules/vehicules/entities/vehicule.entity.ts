import { Column, Entity, PrimaryColumn } from 'typeorm';
import { StatutVehicule } from '../enums/statut-vehicule.enum.js';

@Entity('vehicules')
export class Vehicule {
  @PrimaryColumn({ name: 'immatriculation', type: 'varchar' })
  immatriculation: string;

  @Column({ name: 'marque', type: 'varchar' })
  marque: string;

  @Column({ name: 'modele', type: 'varchar' })
  modele: string;

  @Column({ name: 'type_vehicule', type: 'varchar', nullable: true })
  type_vehicule: string | null;

  @Column({ name: 'capacite', type: 'decimal', precision: 10, scale: 2 })
  capacite: number;

  @Column({ name: 'annee_mise_circulation', type: 'int', nullable: true })
  annee_mise_circulation: number | null;

  @Column({ name: 'date_acquisition', type: 'date', nullable: true })
  date_acquisition: Date | null;

  @Column({ name: 'kilometrage', type: 'int', nullable: true })
  kilometrage: number | null;

  @Column({ name: 'etat', type: 'varchar', nullable: true })
  etat: string | null;

  @Column({
    name: 'statut', type: 'enum', enum: StatutVehicule,
    default: StatutVehicule.DISPONIBLE,
  })
  statut: StatutVehicule;

  @Column({ name: 'date_assurance', type: 'date', nullable: true })
  date_assurance: Date | null;

  @Column({ name: 'date_expiration_assurance', type: 'date', nullable: true })
  date_expiration_assurance: Date | null;

  @Column({ name: 'date_visite_technique', type: 'date', nullable: true })
  date_visite_technique: Date | null;

  @Column({ name: 'date_prochaine_maintenance', type: 'date', nullable: true })
  date_prochaine_maintenance: Date | null;
}
