import { ApiProperty } from '@nestjs/swagger';

export class logoutAuthMessageResponseDto {
  @ApiProperty({ example: 'Đăng xuất thành công' })
  message: string;
}

export class activeAuthMessageResponseDto {
  @ApiProperty({ example: 'Kích hoạt tài khoản thành công' })
  message: string;
}
