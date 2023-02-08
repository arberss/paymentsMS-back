import { Payment } from 'src/schema/payment.schema';

export const calculateDataPerYear = (data: Payment[]) => {
  const obj = {};
  data.forEach((payment: Payment) => {
    payment.payments.forEach((item) => {
      if (!obj[item.payedForYear]) {
        obj[item.payedForYear] = [
          {
            user: payment.user,
            amount: item.amount,
          },
        ];
      } else {
        obj[item.payedForYear] = [
          ...obj[item.payedForYear],
          {
            user: payment.user,
            amount: item.amount,
          },
        ];
      }
    });
  });

  return obj;
};
