// ai-suggestions.service.ts

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as pdfParse from 'pdf-parse';
import axios from 'axios';
import { readFile } from 'fs/promises';


@Injectable()
export class AiSuggestionsService {

  async analyzePdf(file: Express.Multer.File): Promise<any> {
    try {
      const buffer = await readFile(file.path);
      const pdfData = await pdfParse(buffer);

      const prompt = `You are a fitness expert. Analyze this progress report and give improvement suggestions:\n\n${pdfData.text}\n\nSuggestions in JSON format like { "summary": "...", "recommendations": ["...", "..."] }`;

      const response = await axios.post(
        'https://api.together.xyz/v1/chat/completions',
        {
          model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer 83a0fb244dc02ba357614cf99b1b3c92d796b569cd0876b843d2014ccd8b31ce`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('PDF analysis failed');
    }
  }
}
