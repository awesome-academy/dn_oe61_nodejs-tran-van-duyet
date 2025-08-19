import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  old_password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  encrypted_password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  repassword: string;

}
