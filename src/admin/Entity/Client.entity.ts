import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,CreateDateColumn,
  UpdateDateColumn,JoinColumn, 
  OneToMany} from 'typeorm';
import {Nutritionist} from "./Nutritionist.entity";
import { Trainer } from './Trainer.entity';
import { ClientGoal } from './Client-goal.entity';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  gender: string; // e.g., 'Male', 'Female', 'Other'

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'float', nullable: true })
  height: number; // in cm

  @Column({ type: 'float', nullable: true })
  weight: number; // in kg

  @Column({ type: 'float', nullable: true })
  bmi: number;

  @Column({ type: 'text', nullable: true })
  medicalHistory: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Foreign keys
  @ManyToOne(() => Trainer, (trainer) => trainer.clients, { nullable: true })
  trainer: Trainer;
  // @JoinColumn({name: 'trainer_id'})
  
  @ManyToOne(() => Nutritionist, (nutritionist) => nutritionist.clients, { nullable: true })
  nutritionist: Nutritionist;

  @OneToMany(() => ClientGoal, (goal) => goal.client)
  goals: ClientGoal[];
}
