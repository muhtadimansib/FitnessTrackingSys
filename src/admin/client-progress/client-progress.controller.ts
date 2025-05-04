import { Controller, Get, Param, ParseIntPipe, Res } from '@nestjs/common';
import { Response } from 'express';
import { ClientProgressService } from './client-progress.service';

@Controller('client-progress')
export class ClientProgressController {
  constructor(private readonly service: ClientProgressService) {}

  // View client progress
  @Get('progress/:clientId')
  async getProgress(@Param('clientId', ParseIntPipe) clientId: number) {
    return this.service.getProgress(clientId);
  }

  // Export client progress to PDF
  @Get('progress/:clientId/export-pdf')
  async exportPdf(@Param('clientId', ParseIntPipe) clientId: number, @Res() res: Response) {
    const buffer = await this.service.exportProgressAsPDF(clientId);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=client-${clientId}-progress.pdf`,
    });
    res.send(buffer);
  }

  @Get('StepCountChart/:clientId')
  async getChart(@Param('clientId') clientId: number) {
    return {
      chartUrl: await this.service.generateChartStepCount(clientId),
    };
  }

  @Get('SleepChart/:clientId')
  async getChartSleepHour(@Param('clientId') clientId: number) {
    return {
      chartUrl: await this.service.generateChartSleepHour(clientId),
    };
  }

  // Export client progress to Excel
  // @Get('progress/:clientId/export-excel')
  // async exportExcel(@Param('clientId', ParseIntPipe) clientId: number, @Res() res: Response) {
  //   const buffer = await this.service.exportProgressAsExcel(clientId);
  //   res.set({
  //     'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //     'Content-Disposition': `attachment; filename=client-${clientId}-progress.xlsx`,
  //   });
  //   res.send(buffer);
  // }
}
