import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateIf,
} from 'class-validator';
import { paymentsType } from 'src/schema/payment.schema';

export class ActionDto {
  @ValidateIf((values: { [key: string]: any }) => {
    if (!values?.customUserName) return true;
    return false;
  })
  @IsString()
  user: string;

  @ValidateIf((values: { [key: string]: any }) => {
    if (!values?.user) return true;
    return false;
  })
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
  @IsString()
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
