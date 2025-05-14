import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('employee')
export class EmployeeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  login: string;

  @Column('varchar', { length: 255 })
  password: string;

  @Column('varchar', { length: 300, nullable: true })
  email: string;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('varchar', { length: 255 })
  surname: string;

  @Column('varchar', { length: 255 })
  phone: string;

  @Column('varchar', { length: 300, nullable: true })
  address: string;

  @Column('varchar', { length: 255 })
  patronymic: string;

  @Column('boolean', { default: false })
  confirmed: boolean;

  @Column('timestamp')
  date_create: Date;

  @Column('varchar', { default: 'distributor' })
  server: string;

  @Column('timestamp', { nullable: true })
  date_delete: Date;

  @Column('int', { nullable: true })
  id_role: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
