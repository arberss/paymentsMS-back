import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { paymentsType } from 'src/schema/payment.schema';

export class ActionDto {
  @IsNotEmpty()
  @IsString()
  user: string;

  @IsNotEmpty()
  @IsString()
  customUserName: string;

  @IsNotEmpty()
  @IsString()
  type: paymentsType;

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
  @IsNumber()
  payedForMonth: number;

  @IsNotEmpty()
  @IsString()
  exchange: string;

  @IsNotEmpty()
  @IsNumber()
  currency: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  invoiceNr: string;

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
