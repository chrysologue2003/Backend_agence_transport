import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TypeClient } from '../enums/type-client.enum.js';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'nom', type: 'varchar' })
  nom: string;

  @Column({ name: 'prenom', type: 'varchar', nullable: true })
  prenom: string | null;

  @Column({ name: 'telephone', type: 'varchar' })
  telephone: string;

  @Column({ name: 'adresse', type: 'varchar', nullable: true })
  adresse: string | null;

  @Column({ name: 'email', type: 'varchar', nullable: true })
  email: string | null;

  @Column({ name: 'type_client', type: 'enum', enum: TypeClient, nullable: true })
  type_client: TypeClient | null;

  @Column({ name: 'observations', nullable: true, type: 'text' })
  observations: string | null;

  @CreateDateColumn({ name: 'date_creation' })
  date_creation: Date;
}
