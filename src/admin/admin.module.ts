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
dotenv.config(); // Load environment variables

@Module({
  imports: [
    TypeOrmModule.forFeature([PendingUsers, Users]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, AuthService, JwtStrategy],
})
export class AdminModule {}
