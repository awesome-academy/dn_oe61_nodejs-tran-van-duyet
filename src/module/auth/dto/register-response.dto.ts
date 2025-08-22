import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({ example: 'Đăng ký thành công, vui lòng kiểm tra email để kích hoạt.' })
  message: string;
}
