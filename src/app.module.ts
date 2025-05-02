import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PendingUsers } from './admin/PendingUsers.entity';
import { Users } from './admin/users.entity';
import { AuthModule } from './auth/auth.module';
import { Client } from './admin/Entity/Client.entity';
import { Nutritionist } from './admin/Entity/Nutritionist.entity';
import { Trainer } from './admin/Entity/Trainer.entity';
import { NutritionistRating } from './admin/Entity/NutritionistRating.entity';
import { TrainerRating } from './admin/Entity/TrainerRating.entity';

@Module({
  imports: [AdminModule,TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'FitnessTrackerSys',
    entities: [
      PendingUsers,
      Users,
      Client,
      Nutritionist,
      Trainer,
      NutritionistRating,
      TrainerRating
    ],
    synchronize: true,
  }),AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
