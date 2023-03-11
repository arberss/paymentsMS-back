import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payment, PaymentDocument } from 'src/schema/payment.schema';
import { User, UserDocument } from 'src/schema/user.schema';
import { PaymentDto } from './dto/management.dto';
import { calculateDataPerYear, calculateNewTotal } from './utils/helper';
import { isEmpty } from 'lodash';
import { calculatePages } from 'src/utils';

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
              payments: dto,
            },
          },
          { new: true, upsert: true },
        )
        .populate({
          path: 'user',
          select: '-password',
          populate: { path: 'status', select: 'name' },
        })
        .lean();

      const newData = {
        ...payment,
        totalPayed: calculateNewTotal(payment.payments),
      };

      if (!user.payments) {
        await this.userModel.updateOne(
          { _id: user._id },
          { payments: payment._id },
        );
      }

      return newData;
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
              'payments.$.reason': dto.reason,
              'payments.$.paymentDate': dto.paymentDate,
              'payments.$.payedForYear': dto.payedForYear,
              'payments.$.exchange': dto.exchange,
              'payments.$.amount': dto.amount,
              'payments.$.payer': dto.payer,
              'payments.$.paymentReceiver': dto.paymentReceiver,
            },
          },
          { new: true },
        )
        .populate({
          path: 'user',
          select: '-password',
          populate: { path: 'status', select: 'name' },
        })
        .lean();

      const newData = {
        ...response,
        totalPayed: calculateNewTotal(response.payments),
      };

      return newData;
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

  async getPayments(queries: { [key: string]: string }, userId: string) {
    try {
      const paymentsMatch = {
        $match: {
          $and: [
            {
              ...(queries?.search && {
                $or: [
                  {
                    'payments.payer': {
                      $regex: queries?.search,
                      $options: 'i',
                    },
                  },
                  {
                    'payments.householdHeader': {
                      $regex: queries?.search,
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
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: '$user' },
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
            personalNr: { $first: { $toInt: '$user.personalNumber' } },
          },
        },
        { $sort: { personalNr: 1 } },
        {
          $facet: {
            data: [
              {
                $skip: (+queries?.page - 1) * +queries?.size,
              },
              { $limit: +queries?.size },
            ],
            totalPages: [{ $count: 'total' }],
          },
        },
        {
          $addFields: {
            size: +queries?.size,
            page: +queries?.page,
          },
        },
        {
          $project: {
            data: 1,
            pagination: {
              totalPages: { $arrayElemAt: ['$totalPages.total', 0] },
              page: '$page',
              size: '$size',
            },
          },
        },
      ]);

      await this.paymentModel.populate(result[0].data, [
        {
          path: 'user',
          select: '-password -payments',
          populate: {
            path: 'status',
            select: 'name',
          },
        },
      ]);

      if (queries?.by) {
        const data = calculateDataPerYear(result);
        if (isEmpty(data)) {
          return [];
        }
        return data;
      }

      const newPage = calculatePages(
        result?.[0].pagination.totalPages,
        result?.[0].pagination.size,
      );

      return (
        {
          ...result[0],
          pagination: {
            ...result?.[0]?.pagination,
            page: newPage < +queries?.page ? +newPage : +queries?.page,
          },
        } ?? []
      );
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
