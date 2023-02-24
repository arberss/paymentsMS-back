import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PaymentDto {
  @IsNotEmpty()
  @IsString()
  reason: string;

  @IsNotEmpty()
  @IsDateString()
  paymentDate: Date;

  @IsNotEmpty()
  @IsNumber()
  payedForYear: number;

  @IsNotEmpty()
  @IsString()
  exchange: string;

  @IsNotEmpty()
  @IsNumber()
  amount: string;

  @IsNotEmpty()
  @IsString()
  payer: string;

  @IsNotEmpty()
  @IsString()
  paymentReceiver: string;
}
