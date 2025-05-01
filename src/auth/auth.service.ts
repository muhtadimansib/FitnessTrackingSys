import { Injectable, UnauthorizedException,Res } from '@nestjs/common';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../admin/users.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(email: string, password: string, @Res({ passthrough: true }) res: Response) {
    const user = await this.validateUser(email, password);
    const now=new Date();
    const payload = { email: user.email, sub: user.id, role: user.role, time:now.toISOString()};
    const Login_token=this.jwtService.sign(payload);
    
    res.cookie('access_token', Login_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000
      });
    return {
      Login_token,
      email:user.email,
      sub:user.id,
      time:now.toISOString(),
      role: user.role,
    };
  }
}
