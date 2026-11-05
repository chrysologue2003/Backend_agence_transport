import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categories_depenses')
export class CategorieDepense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'libelle', type: 'varchar' })
  libelle: string;

  @Column({ name: 'famille', type: 'varchar', nullable: true })
  famille: string | null;
}
