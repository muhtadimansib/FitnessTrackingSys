import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientGoal } from 'src/admin/Entity/Client-goal.entity';
import { DailyActivity } from 'src/admin/Entity/Daily-activity-logs.entity';
import { WorkoutDietLog } from 'src/admin/Entity/Workout-diet-logs.enitity';
import { Client } from 'src/admin/Entity/Client.entity';
import * as ExcelJS from 'exceljs';
import * as PDFDocument from 'pdfkit';
import { Writable } from 'stream';
import { Buffer } from 'node:buffer'; // Use the Node.js Buffer

@Injectable()
export class ClientProgressService {
  constructor(
    @InjectRepository(ClientGoal)
    private goalRepo: Repository<ClientGoal>,

    @InjectRepository(DailyActivity)
    private activityRepo: Repository<DailyActivity>,

    @InjectRepository(WorkoutDietLog)
    private logRepo: Repository<WorkoutDietLog>,

    @InjectRepository(Client)
    private clientRepo: Repository<Client>,
  ) {}

  // View client progress (Goals, Activities, and Logs)
  async getProgress(clientId: number) {
    const goals = await this.goalRepo.find({
      where: { client: { id: clientId } },
      relations: ['client'],
    });

    const activities = await this.activityRepo.find({
      where: { client: { id: clientId } },
      relations: ['client'],
    });

    const logs = await this.logRepo.find({
      where: { client: { id: clientId } },
      relations: ['client'],
    });

    return {
      goals,
      activities,
      workoutAndDietLogs: logs,
    };
  }


  // Export client progress as PDF
  async exportProgressAsPDF(clientId: number): Promise<Buffer> {
    const { goals, activities, workoutAndDietLogs } = await this.getProgress(clientId);

    const doc = new PDFDocument();
    const chunks: any[] = [];
    const stream = new Writable({
      write(chunk, encoding, callback) {
        chunks.push(chunk);
        callback();
      }
    });
    doc.pipe(stream);

    doc.fontSize(20).text(`Client Progress Report (ID: ${clientId})`, { align: 'center' });
    doc.moveDown();

    doc.fontSize(16).text('Fitness Goals:', { underline: true });
    goals.forEach((g, i) => {
      doc.fontSize(12).text(`${i + 1}. ${g.goal} - ${g.createdAt} (Target: ${g.targetDate})`);
    });

    doc.addPage();
    doc.fontSize(16).text('Daily Activities:', { underline: true });
    activities.forEach((a, i) => {
      doc.fontSize(12).text(`${i + 1}. ${a.date} - Steps: ${a.steps}, Calories: ${a.caloriesBurned}, Sleep: ${a.sleepHours}h`);
    });

    doc.addPage();
    doc.fontSize(16).text('Workout & Diet Logs:', { underline: true });
    workoutAndDietLogs.forEach((log, i) => {
      doc.fontSize(12).text(`${i + 1}. ${log.date} - Workout: ${log.workoutSummary}`);
      doc.text(`Diet: ${log.dietSummary}`);
      doc.moveDown();
    });

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', () => {
        resolve(Buffer.concat(chunks));
      });
      stream.on('error', reject);
    });
  }

  async generateChartStepCount(clientId: number): Promise<string> {
    const activities = await this.activityRepo.find({
      where: { client: { id: clientId } },
      relations: ['client'],
      order: { date: 'ASC' },
    });
  
    const dates = activities.map(a => new Date(a.date).toISOString().split('T')[0]); 
    const steps = activities.map(a => a.steps);
  
    const chartConfig = {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Steps Over Time',
          data: steps,
          borderColor: 'rgba(75, 192, 192, 1)',
          fill: false,
        }]
      },
      options: {
        title: {
          display: true,
          text: `Client ${clientId} - Step Progress`,
        }
      }
    };
  
    const configStr = JSON.stringify(chartConfig);
    const encoded = encodeURIComponent(configStr);
    const url = `https://quickchart.io/chart?c=${encoded}`;
    return url;
  }
  
  async generateChartSleepHour(clientId: number): Promise<string> {
    const activities = await this.activityRepo.find({
      where: { client: { id: clientId } },
      relations: ['client'],
      order: { date: 'ASC' },
    });
  
    const dates = activities.map(a => new Date(a.date).toISOString().split('T')[0]); 
    const SleepHours = activities.map(a => a.sleepHours);
  
    const chartConfig = {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Sleep Hour Over Time',
          data: SleepHours,
          borderColor: 'rgb(0, 78, 78)',
          fill: false,
        }]
      },
      options: {
        title: {
          display: true,
          text: `Client ${clientId} - Sleep Hour`,
        }
      }
    };
  
    const configStr = JSON.stringify(chartConfig);
    const encoded = encodeURIComponent(configStr);
    const url = `https://quickchart.io/chart?c=${encoded}`;
    return url;
  }
  }

