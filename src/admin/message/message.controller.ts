import { Controller, Post, Get, Param, Body, ParseIntPipe, Request, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from '../DTO/message.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('send')
  async sendMessage(
    @Body() createMessageDto: CreateMessageDto,
    @Request() req
  ) {
    const { email, role } = req.user;
    return await this.messageService.sendMessage(createMessageDto, email, role);
  }

  @Get('inbox')
  async getInbox(@Request() req) {
    const { email, role } = req.user;
    return await this.messageService.getInbox(email, role);
  }

  @Get('read/:messageId')
  async readMessage(
    @Param('messageId', ParseIntPipe) messageId: number,
    @Request() req
  ) {
    const { email, role } = req.user;
    return await this.messageService.readMessage(messageId, email, role);
  }
}
