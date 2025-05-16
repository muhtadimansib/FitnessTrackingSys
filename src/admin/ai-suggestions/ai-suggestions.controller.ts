// ai-suggestions.controller.ts

import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AiSuggestionsService } from './ai-suggestions.service';
import { extname } from 'path';

@Controller('ai-suggestions')
export class AiSuggestionsController {
  constructor(private readonly aiSuggestionsService: AiSuggestionsService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async handlePdfUpload(@UploadedFile() file: Express.Multer.File) {
    return this.aiSuggestionsService.analyzePdf(file);
  }
}
