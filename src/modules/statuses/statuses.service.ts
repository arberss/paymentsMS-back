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
      const statuses = await this.statusModel.find();

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

      const createdStatus = await this.statusModel.create({ name });
      return createdStatus;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
