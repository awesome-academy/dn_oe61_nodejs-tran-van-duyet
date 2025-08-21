import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  id?: number;

  @ApiProperty({ description: "Họ và tên mới", example: "Trần Văn B" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: "Email mới", example: "new.email@example.com" })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: "Số điện thoại mới", example: "0987654321", required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: "URL ảnh đại diện mới", example: "https://example.com/new-avatar.jpg", required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ description: "Mô tả mới", example: "Chuyên gia về NestJS.", required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
