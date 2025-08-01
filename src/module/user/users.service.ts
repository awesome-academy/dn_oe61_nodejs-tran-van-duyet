import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/User.entity';
import { Repository } from 'typeorm';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async login(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ 
      where: { email },
      relations: ['role'],
    });
    return user ?? undefined;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }


  async findOne(id: number): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { id },
      relations: ['role'], // <-- Load luôn thông tin của role
    });
  }


  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
