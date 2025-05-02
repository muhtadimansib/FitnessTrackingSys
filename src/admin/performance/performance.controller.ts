// src/admin/performance/performance.controller.ts
import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from '../roles.guard';
import { Roles } from '../roles.decorator';

@Controller('admin/performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('trainer')
  async trainerStats(@Query('id') id: number) {
    return this.performanceService.getTrainerPerformance(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('nutritionist')
  async nutritionistStats(@Query('id') id: number) {
    return this.performanceService.getNutritionistPerformance(id);
  }

  @Get('nutritionist/:id/clients')
  getClientsOfNutritionist(@Param('id', ParseIntPipe) id: number) {
    return this.performanceService.getAssignedClientsForNutritionist(id);
  }

  @Get('trainer/:id/clients')
  getClientsOfTrainer(@Param('id', ParseIntPipe) id: number) {
    return this.performanceService.getAssignedClientsForTrainer(id);
  }
}
