import { Controller, Get, UseGuards, Req, Param, Patch } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {

  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('dashboard')
  getDashboard(@Req() req: any) {
    const {password,role,...withoutPassword}=req.user


    return {
      message: 'Welcome to the Admin Dashboard',
      user: withoutPassword,
    };
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('pendingUsers')
  ShowPendingUsers() {
    return this.adminService.ShowPendingUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('approve-user/:id')
  approveUser(@Param('id') id: number) {
    return this.adminService.approveUser(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('ApprovedUsers')
  ShowApprovedUsers() {
    return this.adminService.ShowApprovedUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('reject-user/:id')
  rejectUser(@Param('id') id: number) {
    return this.adminService.rejectUser(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('rejectedUsers')
  ShowRejectedUsers() {
    return this.adminService.ShowRejectedUsers();
  }
}
