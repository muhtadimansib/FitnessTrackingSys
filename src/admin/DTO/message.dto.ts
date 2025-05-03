import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @IsEmail()
  receiverEmail: string;

  @IsNotEmpty()
  receiverRole: string;

  @IsNotEmpty()
  content: string;
}
