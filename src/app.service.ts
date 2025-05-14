import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './Entities/user.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  async getUserById(id: number) {
    return this.userRepo.findOneBy({ id });
  }
}
