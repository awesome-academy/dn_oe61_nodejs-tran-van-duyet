import { IsNotEmpty, IsOptional, IsString, IsInt, Min, Max, IsEmail } from 'class-validator';
import { User } from 'src/entities/User.entity';

export class CreateUserDto {
  @IsOptional()
  id?: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsNotEmpty()
  @IsString()
  encrypted_password: string;

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
