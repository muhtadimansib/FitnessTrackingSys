import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Client } from './Client.entity';

@Entity()
export class ClientGoal {
  @PrimaryGeneratedColumn()
  id: number;
  
  @ManyToOne(() => Client, (client) => client.goals, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clientId' }) 
  client: Client;

  @Column() 
  clientId: number;

  @Column()
  goal: string; // e.g. "Lose 5kg", "Run 5km"

  @Column({ type: 'date' })
  targetDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  
}
