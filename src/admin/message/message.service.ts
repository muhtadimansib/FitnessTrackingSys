// import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Message } from './message.entity';

// @Injectable()
// export class MessageService {
//   constructor(
//     @InjectRepository(Message)
//     private messageRepository: Repository<Message>,
//   ) {}

//   async sendMessage(
//     senderId: number,
//     senderRole: string,
//     receiverId: number,
//     receiverRole: string,
//     content: string,
//   ) {
//     const message = this.messageRepository.create({
//       senderId,
//       senderRole,
//       receiverId,
//       receiverRole,
//       content,
//     });
//     return await this.messageRepository.save(message);
//   }

//   async getInbox(receiverId: number, receiverRole: string) {
//     return await this.messageRepository.find({
//       where: { receiverId, receiverRole },
//       order: { timestamp: 'DESC' },
//     });
//   }

//   async readMessage(messageId: number, receiverId: number, receiverRole: string) {
//     const message = await this.messageRepository.findOne({ where: { id: messageId } });
  
//     if (!message) throw new NotFoundException('Message not found');
  
//     if (message.receiverId !== receiverId || message.receiverRole !== receiverRole) {
//       throw new ForbiddenException('You are not authorized to read this message');
//     }
  
//     if (!message.seen) {
//       message.seen = true;
//       await this.messageRepository.save(message);
//     }
  
//     return message;
//   }
  
// }








import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from 'src/admin/message/message.entity';
import { CreateMessageDto } from '../DTO/message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async sendMessage(createMessageDto: CreateMessageDto, senderEmail: string, senderRole: string) {
    const message = this.messageRepository.create({
      senderEmail,
      senderRole,
      ...createMessageDto, // receiverEmail, receiverRole, content
    });

    return await this.messageRepository.save(message);
  }

  async getInbox(receiverEmail: string, receiverRole: string) {
    return await this.messageRepository.find({
      where: { receiverEmail, receiverRole },
      order: { timestamp: 'DESC' },
    });
  }

  async readMessage(messageId: number, receiverEmail: string, receiverRole: string) {
    const message = await this.messageRepository.findOne({ where: { id: messageId } });

    if (!message) throw new NotFoundException('Message not found');

    // Make sure the receiver matches
    if (message.receiverEmail !== receiverEmail || message.receiverRole !== receiverRole) {
      throw new NotFoundException('Unauthorized access to message');
    }

    if (!message.seen) {
      message.seen = true;
      await this.messageRepository.save(message);
    }

    return message;
  }

  async countUnreadMessagesForUser(email: string, role: string): Promise<number> {
    return await this.messageRepository.count({
      where: {
        receiverEmail: email,
        receiverRole: role,
        seen: false,
      },
    });
  }


}

