import { paymentsType } from 'src/schema/payment.schema';

export interface FilterPayments {
  filters?: {
    by?: string;
    reason?: string;
    type?: paymentsType;
  };
  search?: string;
}
