import { Entity, PrimaryGeneratedColumn, Column, OneToMany,CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Client } from './Client.entity';
import { NutritionistRating } from './NutritionistRating.entity';

@Entity()
export class Nutritionist {
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
  specialization: string; // e.g., "Weight Loss", "Diabetes Control"

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true })
  experience: number; // in years

  @Column({ nullable: true })
  certification: string; // e.g., "Certified Clinical Nutritionist"

  @Column({ nullable: true })
  profileImageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Client, (client) => client.nutritionist)
  clients: Client[];

  @OneToMany(() => NutritionistRating, (rating) => rating.nutritionist)
  ratings: NutritionistRating[];


}

