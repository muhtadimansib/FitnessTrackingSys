import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import {Nutritionist} from "./Nutritionist.entity";
import { Client } from './Client.entity';

@Entity()
export class NutritionistRating {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Nutritionist, (nutritionist) => nutritionist.ratings)
  nutritionist: Nutritionist;

  @ManyToOne(() => Client)
  client: Client;

  @Column('float')
  rating: number;

  @Column({ type: 'text', nullable: true })
  feedback: string;
}
