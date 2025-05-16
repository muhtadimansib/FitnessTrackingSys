import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PendingUsers } from './PendingUsers.entity';
import { Users } from './users.entity';
import { AuthService } from '../auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/jwt.strategy';
import * as dotenv from 'dotenv';
import { EmailService } from './email.service';
import { PerformanceController } from './performance/performance.controller';
import { PerformanceService } from './performance/performance.service';
import { Client } from './Entity/Client.entity';
import { Trainer } from './Entity/Trainer.entity';
import { Nutritionist } from './Entity/Nutritionist.entity';
import { NutritionistRating } from './Entity/NutritionistRating.entity';
import { TrainerRating } from './Entity/TrainerRating.entity';
import { MessageModule } from './message/message.module';
import { Message } from './message/message.entity';
import { ClientGoal } from './Entity/Client-goal.entity';
import { DailyActivity } from './Entity/Daily-activity-logs.entity';
import { WorkoutDietLog } from './Entity/Workout-diet-logs.enitity';
import { ClientProgressModule } from './client-progress/client-progress.module';
import { ClientProgressController } from './client-progress/client-progress.controller';
import { ClientProgressService } from './client-progress/client-progress.service';
import { AiSuggestionsModule } from './ai-suggestions/ai-suggestions.module';

dotenv.config(); // Load environment variables

@Module({
  imports: [
    TypeOrmModule.forFeature([PendingUsers, Users,Client, Trainer, Nutritionist, NutritionistRating,TrainerRating,Message,ClientGoal,DailyActivity,WorkoutDietLog]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
    }),
    MessageModule,
    ClientProgressModule,
    AiSuggestionsModule,
  ],
  controllers: [AdminController, PerformanceController,ClientProgressController],
  providers: [AdminService, AuthService, JwtStrategy,EmailService, PerformanceService,ClientProgressService],
})
export class AdminModule {}
