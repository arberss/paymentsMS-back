import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Action, ActionDocument } from 'src/schema/action.schema';
import { IPagination } from 'src/types/pagination';
import { calculatePages } from 'src/utils';
import { ActionDto } from './dto/actions.dto';

@Injectable()
export class ActionsService {
  constructor(
    @InjectModel(Action.name) private serviceModel: Model<ActionDocument>,
  ) {}

  async addAction(dto: ActionDto) {
    try {
      const action = await (
        await this.serviceModel.create(dto)
      ).populate({
        path: 'user',
        select: '-password -payments',
      });

      return action;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async getActions({
    pagination: { size, page },
  }: {
    pagination: IPagination;
  }) {
    try {
      const actions = await this.serviceModel.aggregate([
        {
          $facet: {
            data: [{ $skip: (+page - 1) * size }, { $limit: +size }],
            totalPages: [{ $count: 'total' }],
          },
        },
        {
          $addFields: { size: +size, page: +page },
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

      const newPage = calculatePages(
        actions?.[0].pagination.totalPages,
        actions?.[0].pagination.size,
      );

      return actions?.length > 0
        ? {
            ...actions[0],
            pagination: {
              ...actions?.[0]?.pagination,
              page: newPage < page ? +newPage : +page,
            },
          }
        : { data: [] };
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async deleteAction(actionId: string) {
    try {
      const action = await this.serviceModel.findOneAndDelete({
        _id: actionId,
      });

      return { id: action._id.toString };
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
