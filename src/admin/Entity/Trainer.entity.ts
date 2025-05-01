import { Entity, PrimaryGeneratedColumn, Column,OneToMany } from 'typeorm';
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

  @OneToMany(() => Client, (client) => client.trainer)
  clients: Client[];

  @OneToMany(() => TrainerRating, (rating) => rating.trainer)
  ratings: TrainerRating[];
}
