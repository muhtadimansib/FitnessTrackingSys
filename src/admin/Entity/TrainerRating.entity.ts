import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Trainer } from './Trainer.entity';
import { Client } from './Client.entity';

@Entity()
export class TrainerRating {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Trainer, (trainer) => trainer.ratings)
  trainer: Trainer;

  @ManyToOne(() => Client)
  client: Client;

  @Column('float')
  rating: number;

  @Column({ type: 'text', nullable: true })
  feedback: string;
}
