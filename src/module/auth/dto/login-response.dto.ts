import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ example: true })
  status: boolean;
  
  @ApiProperty({ example: 'Đăng nhập thành công.' })
  message: string;
}
