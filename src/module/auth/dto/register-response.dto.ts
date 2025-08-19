import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({ example: 'Đăng ký thành công, vui lòng kiểm tra email để kích hoạt.' })
  message: string;

  @ApiProperty({ example: 1 })
  userId: number;
}
