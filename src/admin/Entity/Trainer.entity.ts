import { Entity, PrimaryGeneratedColumn, Column,OneToMany,CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Client } from './Client.entity';
import { TrainerRating } from './TrainerRating.entity';

@Entity()
export class Trainer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  gender: string; // 'Male', 'Female', 'Other'

  @Column({ nullable: true })
  specialization: string; // e.g., "Strength Training", "Cardio", "Rehab"

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true })
  experience: number; // in years

  @Column({ nullable: true })
  certification: string; // e.g., "ACE Certified Personal Trainer"

  @Column({ nullable: true })
  profileImageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Client, (client) => client.trainer)
  clients: Client[];

  @OneToMany(() => TrainerRating, (rating) => rating.trainer)
  ratings: TrainerRating[];
}
