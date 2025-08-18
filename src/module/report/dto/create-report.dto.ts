import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateReportDto {
  @IsInt()
  type: number; // 1 = feedback, 2 = report

  @IsString()
  @IsNotEmpty()
  content: string; 

  @IsOptional()
  user_id: number;
}
