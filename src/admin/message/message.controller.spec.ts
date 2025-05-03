// import { Test, TestingModule } from '@nestjs/testing';
// import { MessageController } from './message.controller';

// describe('MessageController', () => {
//   let controller: MessageController;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [MessageController],
//     }).compile();

//     controller = module.get<MessageController>(MessageController);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
// });





import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MessageService } from './message.service';
import { CreateMessageDto } from 'src/admin/DTO/message.dto';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async sendMessage(@Body() dto: CreateMessageDto, @Request() req) {
    const { email, role } = req.user;
    return this.messageService.sendMessage(dto, email, role);
  }

  async getInbox(@Request() req) {
    const { email, role } = req.user;
    return this.messageService.getInbox(email, role); // ✅ pass both
  }

  @Get('read/:id')
async readMessage(
  @Param('id', ParseIntPipe) messageId: number,
  @Request() req,
) {
  const { email, role } = req.user;
  return this.messageService.readMessage(messageId, email, role); // ✅ Pass both
}

}
