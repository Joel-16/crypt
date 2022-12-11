import {
  Entity,
  Column,
  CreateDateColumn,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { User } from './user.entities';

@Entity()
export class Wallet extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accountNo: string;

  @Column()
  balance: string;

  @Column()
  bank_code: string;

  @Column({ nullable: true, type: 'json' })
  cards: {
    cardId: string;
    auth_code: string;
    signature: string;
    last4: string;
    bin: string;
    reusable: boolean;
  }[];

  @OneToOne(() => User, (user) => user.wallet, {onDelete : 'CASCADE'})
  user: User;

  @Column()
  @CreateDateColumn()
  created_at: Date;
}
