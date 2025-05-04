import { Entity, PrimaryGeneratedColumn, Column, JoinColumn,ManyToOne } from 'typeorm';
import { Client } from './Client.entity';

@Entity()
export class DailyActivity {
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
  steps: number;

  @Column()
  caloriesBurned: number;

  @Column()
  sleepHours: number;
}
