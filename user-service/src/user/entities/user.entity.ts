import { IsEmail } from 'class-validator';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'users' })
export class User {
  constructor() {
    this.id = uuidv4();
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'boolean' })
  isAdmin: boolean;
}
