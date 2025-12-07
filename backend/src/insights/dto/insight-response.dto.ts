import { IsString, IsNotEmpty } from 'class-validator';

export class InsightResponseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
