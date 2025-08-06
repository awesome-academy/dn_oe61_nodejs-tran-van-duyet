import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/User.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly mailerService: MailerService
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

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { encrypted_password, repassword, ...rest } = createUserDto;
    const hashedPassword = await bcrypt.hash(encrypted_password, 10);
    const token = uuidv4()
    const user = this.usersRepository.create({ ...rest, encrypted_password: hashedPassword, status: 0, registration_token: token });

    try {
      await this.mailerService
        .sendMail({
          to: user.email, // list of receivers
          subject: 'Activate your account', // Subject line
          text: 'welcome', // plaintext body
          template: 'register',
          context: {
            name: user.name,
            activationCode: user.registration_token
          }
        })
      }catch (error) {
      console.error('Failed to send registration email:', error);
      throw new InternalServerErrorException('Unable to send registration email');
    }

    const savedUser = await this.usersRepository.save(user);
    return savedUser;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user ?? undefined;
  }

  async activateAccount(token: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { registration_token: token } });

    if (!user) {
      throw new NotFoundException('Invalid activation token');
    }

    if (user.status === 1) {
      throw new BadRequestException('Account is already activated');
    }

    user.status = 1;
    user.registration_token = null;

    return this.usersRepository.save(user);
  }

}
