import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendEmailDto {
  @IsArray()
  @IsEmail({}, { each: true }) // Validate each email
  recipients: string[];

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  
  @IsOptional()
  @IsString()
   attachments?: { filename: string; path: string }[];
}
