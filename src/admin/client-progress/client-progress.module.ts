import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientProgressService } from './client-progress.service';
import { ClientProgressController } from './client-progress.controller';
import { ClientGoal } from 'src/admin/Entity/Client-goal.entity';
import { DailyActivity } from 'src/admin/Entity/Daily-activity-logs.entity';
import { WorkoutDietLog } from 'src/admin/Entity/Workout-diet-logs.enitity';
import { Client } from 'src/admin/Entity/Client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientGoal, DailyActivity, WorkoutDietLog, Client])],
  controllers: [ClientProgressController],
  providers: [ClientProgressService],
})
export class ClientProgressModule {}
