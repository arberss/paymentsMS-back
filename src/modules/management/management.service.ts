import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payment, PaymentDocument } from 'src/schema/payment.schema';
import { User, UserDocument } from 'src/schema/user.schema';
import { FilterPayments } from 'src/types/filter';
import { PaymentDto } from './dto/management.dto';
import { calculateDataPerYear } from './utils/helper';
import { isEmpty } from 'lodash';

@Injectable()
export class ManagementService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async addPayment(dto: PaymentDto, userId: string) {
    try {
      const user = await this.userModel.findById(userId).select('-password');
      if (!user) {
        throw new ForbiddenException('Ky user nuk ekziston');
      }

      const payment = await this.paymentModel
        .findOneAndUpdate(
          { user: user._id },
          {
            $push: {
              payments: {
                ...dto,
                householdHeader:
                  dto.householdHeader ?? `${user.firstName} ${user.lastName}`,
              },
            },
          },
          { new: true, upsert: true },
        )
        .populate('user', '-password');

      if (!user.payments) {
        await this.userModel.updateOne(
          { _id: user._id },
          { payments: payment._id },
        );
      }

      return payment;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async editPayment(
    dto: PaymentDto,
    params: { userId: string; paymentId: string },
  ) {
    try {
      const user = await this.userModel
        .findById(params.userId)
        .select('-password');
      if (!user) {
        throw new ForbiddenException('Ky user nuk ekziston');
      }

      const response = await this.paymentModel
        .findOneAndUpdate(
          {
            user: params.userId,
            'payments._id': params.paymentId,
          },
          {
            $set: {
              'payments.$.type': dto.type,
              'payments.$.reason': dto.reason,
              'payments.$.paymentDate': dto.paymentDate,
              'payments.$.payedForYear': dto.payedForYear,
              'payments.$.exchange': dto.exchange,
              'payments.$.amount': dto.amount,
              'payments.$.householdHeader':
                dto.householdHeader ?? `${user.firstName} ${user.lastName}`,
              'payments.$.payer': dto.payer,
              'payments.$.paymentReceiver': dto.paymentReceiver,
              'payments.$.nrOfPersons': dto.nrOfPersons,
            },
          },
          { new: true },
        )
        .populate('user', '-password');

      return response;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async getPayment({
    userId,
    paymentId,
  }: {
    userId: string;
    paymentId: string;
  }) {
    try {
      const payment = await this.paymentModel
        .findOne(
          {
            ...(userId && { user: userId }),
            'payments._id': paymentId,
          },
          { 'payments.$': 1 },
        )
        .populate('user', '_id')
        .lean();

      if (!payment) {
        throw new ForbiddenException('Kjo pagese nuk ekziston!');
      }

      if (payment.payments.length > 0) {
        return { user: payment._id.toString(), ...payment.payments[0] };
      } else {
        return {};
      }
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async getPayments(userId: string, { filters, search }: FilterPayments) {
    try {
      const paymentsMatch = {
        $match: {
          $and: [
            {
              ...(filters?.type && {
                'payments.type': filters?.type,
              }),
            },
            {
              ...(search && {
                $or: [
                  { 'payments.payer': { $regex: search, $options: 'i' } },
                  {
                    'payments.householdHeader': {
                      $regex: search,
                      $options: 'i',
                    },
                  },
                ],
              }),
            },
          ],
        },
      };
      const userMatch = {
        $match: {
          ...(userId && { user: new Types.ObjectId(userId) }),
        },
      };

      const result = await this.paymentModel.aggregate([
        {
          ...userMatch,
        },
        {
          $unwind: {
            path: '$payments',
            preserveNullAndEmptyArrays: true,
          },
        },
        { ...paymentsMatch },
        {
          $group: {
            _id: '$_id',
            user: {
              $first: '$user',
            },
            payments: {
              $push: '$payments',
            },
            totalPayed: {
              $sum: '$payments.amount',
            },
          },
        },
        {
          $project: {
            user: '$user',
            payments: 1,
            totalPayed: 1,
          },
        },
      ]);

      await this.paymentModel.populate(result, [
        {
          path: 'user',
          select: '-password -payments',
          populate: {
            path: 'status',
            select: 'name',
          },
        },
      ]);

      if (filters?.by) {
        const data = calculateDataPerYear(result);
        if (isEmpty(data)) {
          return [];
        }
        return data;
      }

      return result;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async deletePayment(paymentId: string) {
    try {
      const payment = await this.paymentModel.findOne(
        {
          'payments._id': paymentId,
        },
        { 'payments.$': 1 },
      );

      if (!payment) {
        throw new ForbiddenException('Kjo pagese nuk ekziston!');
      }

      await this.paymentModel.updateOne(
        {},
        {
          $pull: {
            payments: {
              _id: paymentId,
            },
          },
        },
      );

      return { paymentId };
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
