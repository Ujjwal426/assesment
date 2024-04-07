import { IsEmail } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'entities' })
export class AccessKey {
  constructor() {
    this.id = uuidv4();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  requestsPerMinute: string;

  @Column({ type: 'varchar' })
  userId: string;

  @Column({ type: 'varchar' })
  key: string;

  @Column({ type: 'date' })
  expirationDate: Date;

  @Column({ type: 'boolean' })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
