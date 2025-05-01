import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PendingUsers } from './PendingUsers.entity';

@Injectable()
export class AdminService {

    constructor(@InjectRepository(PendingUsers) private PendingUsersRepo: Repository<PendingUsers>){}

    ShowPendingUsers()
        {
            return this.PendingUsersRepo.find({ where: { Status: 'Pending' } });
        }

    ShowRejectedUsers()
        {
            return this.PendingUsersRepo.find({where: {Status: 'Rejected'}})
        }

    ShowApprovedUsers()
    {
        {
            return this.PendingUsersRepo.find({where: {Status: 'Approved'}})
        }
    }

    // Approve a pending user by ID
    async approveUser(id: number): Promise<string> {
        const user = await this.PendingUsersRepo.findOne({ where: { UserId: id } });

        if (!user) {
        throw new NotFoundException('User not found');
        }

        if (user.Status !== 'Pending') {
        return `User is already ${user.Status}`;
        }

        user.Status = 'Approved';
        await this.PendingUsersRepo.save(user);

        return 'User approved successfully';
    }

    //Reject a user
    async rejectUser(id: number): Promise<string> {
        const user = await this.PendingUsersRepo.findOne({ where: { UserId: id } });

        if (!user) {
        throw new NotFoundException('User not found');
        }

        if (user.Status !== 'Pending') {
        return `User is already ${user.Status}`;
        }

        user.Status = 'Rejected';
        await this.PendingUsersRepo.save(user);

        return 'User rejected successfully';
    }
}
