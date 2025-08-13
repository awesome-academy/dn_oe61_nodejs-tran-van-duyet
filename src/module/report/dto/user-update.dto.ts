import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class userUpdateReportDto {
  @IsInt()
  type: number; // 1 = feedback, 2 = report

  @IsString()
  @IsNotEmpty()
  content: string; 
}
