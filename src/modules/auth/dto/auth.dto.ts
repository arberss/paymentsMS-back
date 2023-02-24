import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsEmail()
  email?: string;

  @IsString()
  password?: string;

  @IsString()
  confirmPassword?: string;

  @IsNotEmpty()
  @IsNumber()
  personalNumber: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsString()
  role: string;
}

export class SigninAuthDto {
  @IsNotEmpty()
  emailOrPersonalNumber: string;

  @IsNotEmpty()
  password: string;
}
