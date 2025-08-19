import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ description: "Mật khẩu cũ", example: "oldPassword123" })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  old_password: string;

  @ApiProperty({ description: "Mật khẩu mới", example: "newPassword456" })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  encrypted_password: string;

  @ApiProperty({ description: "Nhập lại mật khẩu mới", example: "newPassword456" })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  repassword: string;
}
