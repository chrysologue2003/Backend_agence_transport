import { Column, Entity, PrimaryColumn } from 'typeorm';
import { StatutChauffeur } from '../enums/statut-chauffeur.enum.js';

@Entity('chauffeurs')
export class Chauffeur {
  @PrimaryColumn({ name: 'matricule', type: 'varchar' })
  matricule: string;

  @Column({ name: 'nom', type: 'varchar' })
  nom: string;

  @Column({ name: 'prenom', type: 'varchar', nullable: true })
  prenom: string | null;

  @Column({ name: 'telephone', type: 'varchar' })
  telephone: string;

  @Column({ name: 'adresse', type: 'varchar', nullable: true })
  adresse: string | null;

  @Column({ name: 'numero_permis', type: 'varchar' })
  numero_permis: string;

  @Column({ name: 'categorie_permis', type: 'varchar', nullable: true })
  categorie_permis: string | null;

  @Column({ name: 'date_expiration_permis', type: 'date', nullable: true })
  date_expiration_permis: Date | null;

  @Column({ name: 'date_embauche', type: 'date', nullable: true })
  date_embauche: Date | null;

  @Column({
    name: 'statut', type: 'enum', enum: StatutChauffeur,
    default: StatutChauffeur.DISPONIBLE,
  })
  statut: StatutChauffeur;
}
