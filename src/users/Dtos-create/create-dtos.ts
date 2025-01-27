import { IsString, IsEmail } from 'class-validator';
export class CreateDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @IsString()
  role?: string;
}
