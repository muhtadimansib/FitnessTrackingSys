import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PendingUsers } from './admin/PendingUsers.entity';
import { Users } from './admin/users.entity';
import { AuthModule } from './auth/auth.module';

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
      Users
    ],
    synchronize: true,
  }),AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
