import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum TypeMouvement {
  ENTREE = 'ENTREE',
  SORTIE = 'SORTIE',
}

@Entity('mouvements_caisse')
export class MouvementCaisse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'date_mouvement', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_mouvement: Date;

  @Column({ name: 'type_mouvement', type: 'enum', enum: TypeMouvement })
  type_mouvement: TypeMouvement;

  @Column({ name: 'montant', type: 'decimal', precision: 12, scale: 2 })
  montant: number;

  @Column({ name: 'source', type: 'varchar' })
  source: string;

  @Column({ name: 'solde_apres', type: 'decimal', precision: 12, scale: 2 })
  solde_apres: number;
}
