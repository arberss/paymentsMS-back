import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { paymentsType } from 'src/schema/payment.schema';

export class PaymentDto {
  @IsNotEmpty()
  @IsString()
  type: paymentsType;

  @IsNotEmpty()
  @IsString()
  reason: string;

  @IsNotEmpty()
  @IsDate()
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

  @IsString()
  householdHeader: string;

  @IsNotEmpty()
  @IsString()
  payer: string;

  @IsNotEmpty()
  @IsString()
  paymentReceiver: string;

  @IsNotEmpty()
  @IsNumber()
  nrOfPersons: number;
}
