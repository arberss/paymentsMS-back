import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Status, StatusDocument } from 'src/schema/status.schema';

@Injectable()
export class StatusesService {
  constructor(
    @InjectModel(Status.name) private statusModel: Model<StatusDocument>,
  ) {}

  async getStatuses() {
    try {
      const statuses = await this.statusModel.find();

      return statuses;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
