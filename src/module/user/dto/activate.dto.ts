import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ActivateDto {
  @ApiProperty({
    description: 'Mã token kích hoạt được gửi qua email',
    example: 'some-activation-token',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
