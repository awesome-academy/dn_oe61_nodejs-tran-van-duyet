import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/User.entity';
import { Not, Repository } from 'typeorm';
import { I18nContext } from 'nestjs-i18n';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(id: number, i18n: I18nContext): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        description: true,
      },
    });

    if (!user) {
      throw new NotFoundException(i18n.t('user.user_not_found'));
    }

    return user;
  }

  async update(
    id: number,
    updateProfileDto: UpdateProfileDto,
    i18n: I18nContext,
  ): Promise<User> {
    const user = await this.findOne(id, i18n);
    if (updateProfileDto.email && updateProfileDto.email !== user.email) {
      const existing = await this.userRepository.findOne({
        where: { email: updateProfileDto.email, id: Not(id) },
      });

      if (existing) {
        throw new BadRequestException(i18n.t('user.email_already_exists'));
      }

      user.email = updateProfileDto.email;
    }
    user.name = updateProfileDto.name;
    if (updateProfileDto.phone !== undefined) {
      user.phone = updateProfileDto.phone;
    }

    if (updateProfileDto.avatar !== undefined) {
      user.avatar = updateProfileDto.avatar;
    }

    if (updateProfileDto.description !== undefined) {
      user.description = updateProfileDto.description;
    }

    return await this.userRepository.save(user);
  }

  async changePassword(
    id: number,
    changePasswordDto: ChangePasswordDto,
    i18n: I18nContext,
  ): Promise<{ message: string }> {
    const user = await this.findOne(id, i18n);

    const isMatch = await bcrypt.compare(
      changePasswordDto.old_password,
      user.encrypted_password,
    );
    if (!isMatch) {
      throw new BadRequestException(i18n.t('user.invalid_old_password'));
    }

    if (changePasswordDto.encrypted_password !== changePasswordDto.repassword) {
      throw new BadRequestException(i18n.t('user.passwords_do_not_match'));
    }

    const hashed = await bcrypt.hash(changePasswordDto.encrypted_password, 10);
    user.encrypted_password = hashed;

    await this.userRepository.save(user);

    return { message: i18n.t('user.password_changed_successfully') };
  }
}
