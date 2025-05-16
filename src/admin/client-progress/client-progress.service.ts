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
import * as https from 'https';
import * as path from 'path';
import * as fs from 'fs';

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

  // Prepare scatter data
  const scatterData = activities.map(a => ({
    x: a.caloriesBurned,
    y: a.steps,
  }));

  // --- Linear Regression (y = a * x + b) ---
  const n = scatterData.length;
  const sumX = scatterData.reduce((acc, val) => acc + val.x, 0);
  const sumY = scatterData.reduce((acc, val) => acc + val.y, 0);
  const sumXY = scatterData.reduce((acc, val) => acc + val.x * val.y, 0);
  const sumX2 = scatterData.reduce((acc, val) => acc + val.x * val.x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Generate regression line points from minX to maxX
  const minX = Math.min(...scatterData.map(p => p.x));
  const maxX = Math.max(...scatterData.map(p => p.x));

  const regressionLine = [
    { x: minX, y: slope * minX + intercept },
    { x: maxX, y: slope * maxX + intercept },
  ];

  const chartConfig = {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Calories Burned vs Steps Count',
          data: scatterData,
          backgroundColor: 'rgba(54, 162, 235, 1)',
        },
        {
          label: `Trend Line (y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)})`,
          data: regressionLine,
          type: 'line',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          fill: false,
          pointRadius: 0,
          showLine: true,
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: `Client ${clientId} - Calories Burned vs Steps`,
          font: { size: 18 },
        },
        legend: { display: true },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Calories Burned',
          },
          beginAtZero: true,
        },
        y: {
          title: {
            display: true,
            text: 'Steps',
          },
          beginAtZero: true,
        },
      },
    },
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






  async generateSleepEfficiencyVsCaloriesChart(clientId: number): Promise<string> {
  const activities = await this.activityRepo.find({
    where: { client: { id: clientId } },
    relations: ['client'],
    order: { date: 'ASC' },
  });

  // Prepare chart data: x = Calories Burned, y = Sleep Efficiency Ratio
  const scatterData = activities.map((a) => {
    const sleepEfficiencyRatio = (a.sleepHours / 24) * 100;
    return {
      x: a.caloriesBurned,
      y: parseFloat(sleepEfficiencyRatio.toFixed(2)),
    };
  });

  // Perform linear regression manually to get trend line
  const n = scatterData.length;
  const sumX = scatterData.reduce((acc, val) => acc + val.x, 0);
  const sumY = scatterData.reduce((acc, val) => acc + val.y, 0);
  const sumXY = scatterData.reduce((acc, val) => acc + val.x * val.y, 0);
  const sumX2 = scatterData.reduce((acc, val) => acc + val.x * val.x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const minX = Math.min(...scatterData.map((p) => p.x));
  const maxX = Math.max(...scatterData.map((p) => p.x));
  const trendLineData = [
    { x: minX, y: slope * minX + intercept },
    { x: maxX, y: slope * maxX + intercept },
  ];

  const chartConfig = {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Sleep Efficiency vs Calories Burned',
          data: scatterData,
          backgroundColor: 'rgba(75, 192, 192, 1)',
        },
        {
          label: 'Trend Line',
          data: trendLineData,
          type: 'line',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          fill: false,
          pointRadius: 0,
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: `Client ${clientId} - Sleep Efficiency Ratio vs Calories Burned`,
          font: {
            size: 18,
          },
        },
        legend: {
          display: true,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Calories Burned',
          },
          beginAtZero: true,
        },
        y: {
          title: {
            display: true,
            text: 'Sleep Efficiency (%)',
          },
          min: 0,
          max: 100,
        },
      },
    },
  };

  const configStr = JSON.stringify(chartConfig);
  const encoded = encodeURIComponent(configStr);
  const url = `https://quickchart.io/chart?c=${encoded}`;

  return url;
}






async generateBubbleChart(clientId: number): Promise<string> {
  const activities = await this.activityRepo.find({
    where: { client: { id: clientId } },
    relations: ['client'],
    order: { date: 'ASC' },
  });

  const bubbleData = activities.map((a) => ({
    x: a.caloriesBurned,
    y: a.steps,
    r: a.sleepHours, // Bubble radius represents sleep hours
  }));

  const chartConfig = {
    type: 'bubble',
    data: {
      datasets: [
        {
          label: 'Client Daily Activity',
          data: bubbleData,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: `Client ${clientId} - Calories vs Steps (Bubble = Sleep Hours)`,
          font: { size: 18 },
        },
      },
      scales: {
        x: {
          title: { display: true, text: 'Calories Burned' },
          beginAtZero: true,
        },
        y: {
          title: { display: true, text: 'Steps Count' },
          beginAtZero: true,
        },
      },
    },
  };

  const encoded = encodeURIComponent(JSON.stringify(chartConfig));
  const url = `https://quickchart.io/chart?c=${encoded}`;
  return url;
}








private fetchImageBuffer(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}


async exportProgressAsPDFwithChart(clientId: number): Promise<Buffer> {
  const { goals, activities, workoutAndDietLogs } = await this.getProgress(clientId);

  const doc = new PDFDocument();
  const chunks: any[] = [];

  const stream = new Writable({
    write(chunk, encoding, callback) {
      chunks.push(chunk);
      callback();
    }
  });

  //Ensure the directory exists
  const exportDir = path.join(process.cwd(), 'exports'); // writes to project root
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  //Define file path
  //const filePath = path.join(exportDir, `client-progress-${clientId}.pdf`);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // e.g., 2025-05-16T12-30-59-123Z
  const filePath = path.join(exportDir, `client-progress-${clientId}-${timestamp}.pdf`);

  const fileStream = fs.createWriteStream(filePath);

  doc.pipe(stream);
  doc.pipe(fileStream);

  // Header
  doc.fontSize(20).text(`Client Progress Report (ID: ${clientId})`, { align: 'center' });
  doc.moveDown();

  // Goals
  doc.fontSize(16).text('Fitness Goals:', { underline: true });
  goals.forEach((g, i) => {
    doc.fontSize(12).text(`${i + 1}. ${g.goal} - ${g.createdAt} (Target: ${g.targetDate})`);
  });

  doc.addPage();

  // Activities
  doc.fontSize(16).text('Daily Activities:', { underline: true });
  activities.forEach((a, i) => {
    doc.fontSize(12).text(`${i + 1}. ${a.date} - Steps: ${a.steps}, Calories: ${a.caloriesBurned}, Sleep: ${a.sleepHours}h`);
  });

  doc.addPage();

  // Workout & Diet Logs
  doc.fontSize(16).text('Workout & Diet Logs:', { underline: true });
  workoutAndDietLogs.forEach((log, i) => {
    doc.fontSize(12).text(`${i + 1}. ${log.date} - Workout: ${log.workoutSummary}`);
    doc.text(`Diet: ${log.dietSummary}`);
    doc.moveDown();
  });

  doc.addPage();

  // 🔹 Embed Bubble Chart Image
  doc.fontSize(16).text('Activity Bubble Chart:', { underline: true });
  doc.moveDown();

  const chartUrlBubbleChart = await this.generateBubbleChart(clientId); // returns quickchart.io image URL
  const chartImageBufferBubbleChart = await this.fetchImageBuffer(chartUrlBubbleChart);
  doc.image(chartImageBufferBubbleChart, {
    fit: [500, 300], // scale image
    align: 'center',
    valign: 'center',
  });

  doc.addPage();

  // 🔹 Embed Sleep Effieciency vs Calories Burned Scatter Plot chart
  doc.fontSize(16).text('Activity Sleep Effieciency vs Calories Burned Scatter Plot chart:', { underline: true });
  doc.moveDown();

  const chartUrlSleepEffieciencyScatter = await this.generateSleepEfficiencyVsCaloriesChart(clientId); // returns quickchart.io image URL
  const chartImageBufferSleepEffieciency = await this.fetchImageBuffer(chartUrlSleepEffieciencyScatter);
  doc.image(chartImageBufferSleepEffieciency, {
    fit: [500, 300], // scale image
    align: 'center',
    valign: 'center',
  });

  doc.addPage();

  // 🔹 Embed Sleep Hours Over Time
  doc.fontSize(16).text('Activity Sleep Hours Over Time chart:', { underline: true });
  doc.moveDown();

  const chartUrlSleepHour = await this.generateChartSleepHour(clientId); // returns quickchart.io image URL
  const chartImageBufferSleepHour = await this.fetchImageBuffer(chartUrlSleepHour);
  doc.image(chartImageBufferSleepHour, {
    fit: [500, 300], // scale image
    align: 'center',
    valign: 'center',
  });

    doc.addPage();

  // 🔹 Embed Calories Burned Vs Step Count Scatter Chart
  doc.fontSize(16).text('Activity Calories Burned Vs Step Count Scatter chart:', { underline: true });
  doc.moveDown();

  const chartUrlCaloriesVsStep = await this.generateChartStepCount(clientId); // returns quickchart.io image URL
  const chartImageBufferCaloriesVsStep = await this.fetchImageBuffer(chartUrlCaloriesVsStep);
  doc.image(chartImageBufferCaloriesVsStep, {
    fit: [500, 300], // scale image
    align: 'center',
    valign: 'center',
  });

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => {
      resolve(Buffer.concat(chunks));
    });
    stream.on('error', reject);
  });
}

}

