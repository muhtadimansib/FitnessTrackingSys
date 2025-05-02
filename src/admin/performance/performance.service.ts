import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trainer } from 'src/admin/Entity/Trainer.entity';
import { Nutritionist } from 'src/admin/Entity/Nutritionist.entity';
import { TrainerRating } from 'src/admin/Entity/TrainerRating.entity';
import { NutritionistRating } from 'src/admin/Entity/NutritionistRating.entity';
import { Client } from 'src/admin/Entity/Client.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PerformanceService {
  constructor(
    @InjectRepository(Trainer)
    private trainerRepo: Repository<Trainer>,

    @InjectRepository(Nutritionist)
    private nutritionistRepo: Repository<Nutritionist>,

    @InjectRepository(TrainerRating)
    private trainerRatingRepo: Repository<TrainerRating>,

    @InjectRepository(NutritionistRating)
    private nutritionistRatingRepo: Repository<NutritionistRating>,

    @InjectRepository(Client)
    private clientRepo: Repository<Client>,
  ) {}

  async getTrainerPerformance(trainerId: number) {
    // Check if any ratings exist for this trainer
    const hasRating = await this.trainerRatingRepo.findOne({
      where: { trainer: { id: trainerId } },
    });
  
    if (!hasRating) {
      throw new NotFoundException(`No ratings found for Trainer with ID ${trainerId}`);
    }
  
    // Get average rating
    const averageRating = await this.trainerRatingRepo
      .createQueryBuilder('rating')
      .select('AVG(rating.rating)', 'avg')
      .where('rating.trainerId = :trainerId', { trainerId })
      .getRawOne();
  
    // Count assigned clients
    const assignedClients = await this.clientRepo.count({
      where: { trainer: { id: trainerId } },
    });

    const trainer = await this.trainerRepo.findOne({
        where: { id: trainerId }
      });
  
    return {
      trainerId,
      averageRating: parseFloat(averageRating.avg) || 0,
      assignedClientCount: assignedClients,
    };
  }

  async getNutritionistPerformance(nutritionistId: number) {
    // Check if any ratings exist for this nutritionist
    const hasRating = await this.nutritionistRatingRepo.findOne({
      where: { nutritionist: { id: nutritionistId } },
    });
  
    if (!hasRating) {
      throw new NotFoundException(`No ratings found for Nutritionist with ID ${nutritionistId}`);
    }
  
    // Get average rating
    const averageRating = await this.nutritionistRatingRepo
      .createQueryBuilder('rating')
      .select('AVG(rating.rating)', 'avg')
      .where('rating.nutritionistId = :nutritionistId', { nutritionistId })
      .getRawOne();
  
    // Count assigned clients
    const assignedClients = await this.clientRepo.count({
      where: { nutritionist: { id: nutritionistId } },
    });
  
    return {
      nutritionistId,
      averageRating: parseFloat(averageRating.avg) || 0,
      assignedClientCount: assignedClients,
    };
  }

  async getAssignedClientsForNutritionist(nutritionistId: number) {
    const nutritionist = await this.nutritionistRepo.findOne({
      where: { id: nutritionistId },
      relations: ['clients'],
    });

    if (!nutritionist) {
      throw new NotFoundException('Nutritionist not found');
    }

    if (!nutritionist.clients || nutritionist.clients.length === 0) {
      throw new NotFoundException('No clients assigned to this nutritionist');
    }

    return {
        nutritionist_id:nutritionist.id,
        nutritionist_name:nutritionist.name,
        nutritionist_bio:nutritionist.bio,
        nutritionist_gender:nutritionist.gender,
        nutritionist_experience:nutritionist.experience,
        clients: nutritionist.clients
    };
  }

  async getAssignedClientsForTrainer(trainerId: number) {
    const trainer = await this.trainerRepo.findOne({
      where: { id: trainerId },
      relations: ['clients'],
    });

    // Check if trainer exists
    if (!trainer) {
        throw new NotFoundException('Trainer not found');
    }

    // Check if the trainer has any assigned clients
    if (trainer.clients.length === 0) {
        throw new NotFoundException('No clients assigned to this trainer');
    }

    return { 
        trainer_id:trainer.id,
        trainer_name:trainer.name,
        trainer_bio:trainer.bio,
        trainer_gender:trainer.gender,
        trainer_experience:trainer.experience,
        clients: trainer.clients
    };
}


}
