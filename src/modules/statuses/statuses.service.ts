import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Status, StatusDocument } from 'src/schema/status.schema';
import { StatusDto } from './dto/status.dto';

@Injectable()
export class StatusesService {
  constructor(
    @InjectModel(Status.name) private statusModel: Model<StatusDocument>,
  ) {}

  async getStatuses() {
    try {
      const statuses = await this.statusModel.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: 'status',
            as: 'userStatus',
          },
        },
        {
          $project: {
            id: 1,
            name: 1,
            users: { $size: '$userStatus' },
          },
        },
      ]);

      return statuses;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async addStatus({ name }: StatusDto) {
    try {
      const status = await this.statusModel.findOne({ name });
      if (status) {
        throw new ForbiddenException('Ekziston status me kete emer!');
      }

      const createdStatus = await this.statusModel.create({ name, users: [] });
      return createdStatus;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
