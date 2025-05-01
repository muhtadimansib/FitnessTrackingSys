import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
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

  @OneToMany(() => Client, (client) => client.nutritionist)
  clients: Client[];

  @OneToMany(() => NutritionistRating, (rating) => rating.nutritionist)
  ratings: NutritionistRating[];
}

