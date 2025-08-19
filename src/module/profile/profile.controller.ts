import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from 'src/common/decorators/user.decorator';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuardUser } from '../auth/jwt-auth.guard-user';

@UseGuards(JwtAuthGuardUser)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getDataUser(@User() user, @I18n() i18n: I18nContext) {
    const data = await this.profileService.findOne(+user.sub, i18n);
    return { data: data };
  }

  @Patch()
  async update(
    @User() user,
    @Body() updateProfileDto: UpdateProfileDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.profileService.update(+user.sub, updateProfileDto, i18n);
    return {
      status: true,
      message: i18n.t('user.update_success'),
      data: data,
    };
  }

  @Post()
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @User() user,
    @I18n() i18n: I18nContext,
  ) {
    return await this.profileService.changePassword(+user.sub,changePasswordDto,i18n);
  }
}
