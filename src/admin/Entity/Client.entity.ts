import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import {Nutritionist} from "./Nutritionist.entity";
import { Trainer } from './Trainer.entity';

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

  // Foreign keys
  @ManyToOne(() => Trainer, (trainer) => trainer.clients, { nullable: true })
  trainer: Trainer;

  @ManyToOne(() => Nutritionist, (nutritionist) => nutritionist.clients, { nullable: true })
  nutritionist: Nutritionist;
}
