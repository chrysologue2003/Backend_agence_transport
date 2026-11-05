import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('types_prestations')
export class TypePrestation {
  @PrimaryColumn({ name: 'code', type: 'varchar' })
  code: string;

  @Column({ name: 'libelle', type: 'varchar' })
  libelle: string;
}
