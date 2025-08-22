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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChangePasswordResponseDto, GetProfileResponseDto, UpdateProfileResponseDto } from './dto/profile-responses.dto';

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuardUser)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy thông tin profile của người dùng hiện tại' })
  @ApiResponse({ status: 200, description: 'Thành công.', type: GetProfileResponseDto })
  @ApiResponse({ status: 404, description: 'Người dùng không tồn tại' })
  async getDataUser(@User() user, @I18n() i18n: I18nContext) {
    const data = await this.profileService.findOne(+user.sub, i18n);
    return { data: data };
  }

  @Patch()
  @ApiOperation({ summary: 'Cập nhật thông tin profile' })
  @ApiResponse({ status: 200, description: 'Cập nhật người dùng thành công.', type: UpdateProfileResponseDto })
  @ApiResponse({ status: 400, description: 'Email này đã được sử dụng' })
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
  @ApiOperation({ summary: 'Đổi mật khẩu' })
  @ApiResponse({ status: 201, description: 'Đổi mật khẩu thành công', type: ChangePasswordResponseDto })
  @ApiResponse({ status: 400, description: 'Mật khẩu cũ không chính xác / Mật khẩu không khớp' })
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @User() user,
    @I18n() i18n: I18nContext,
  ) {
    const message = await this.profileService.changePassword(+user.sub,changePasswordDto,i18n);
    return {
      status: true,
      message: message
    }
  }
}
