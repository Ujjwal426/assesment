import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'keylogs' })
export class KeyLog {
  constructor() {
    this.id = uuidv4();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  key: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
