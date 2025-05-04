import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn,ManyToOne } from 'typeorm';
import { Client } from './Client.entity';

// src/entities/workout-diet-log.entity.ts
@Entity()
export class WorkoutDietLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client, (client) => client.goals, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clientId' }) 
  client: Client;
    
  @Column() 
  clientId: number;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  workoutSummary: string;

  @Column()
  dietSummary: string;
}
