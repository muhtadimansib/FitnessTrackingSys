import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from './DTO/send-email.dto';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'nightshadow1305@gmail.com',
      pass: 'kgig vxoc txmy nuiu', // App password, not regular password
    },
  });

  async sendBulkEmail(dto: SendEmailDto): Promise<string> {
    const mailOptions = {
      from: '"Fitness Tracker" <your-email@gmail.com>',
      to: dto.recipients.join(','),
      subject: dto.subject,
      text: dto.message,
    };

    await this.transporter.sendMail(mailOptions);
    return 'Emails sent successfully!';
  }
}
