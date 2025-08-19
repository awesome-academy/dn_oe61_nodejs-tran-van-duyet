import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsOptional()
  id?: number;

  @ApiProperty({ description: "Tên người dùng", example: "Nguyễn Văn A" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: "Email đăng ký", example: "register@example.com" })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: "Mật khẩu", example: "password123" })
  @IsNotEmpty()
  @IsString()
  encrypted_password: string;

  @ApiProperty({ description: "Xác nhận mật khẩu", example: "password123" })
  @IsString()
  @IsNotEmpty()
  repassword: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  role_id?: number;

  @IsOptional()
  @IsString()
  plan_id?: number;

  @IsOptional()
  @IsString()
  status?: number;

}
