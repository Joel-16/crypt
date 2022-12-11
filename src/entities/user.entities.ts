import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { Wallet } from './wallet.entities';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true, select: false })
  password: string;

  @Column({ nullable: true })
  verified: boolean;

  @Column({ nullable: true })
  firstname: string;

  @Column({ nullable: true })
  lastname: string;

  @Column({ unique: true })
  email: string;

  @OneToOne(() => Wallet, (wallet) => wallet.user, { nullable: true, eager: true })
  @JoinColumn()
  wallet: Wallet;



  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}
