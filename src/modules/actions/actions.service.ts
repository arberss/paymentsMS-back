import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Action, ActionDocument } from 'src/schema/action.schema';
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

  async getActions() {
    try {
      const actions = await this.serviceModel.find().populate({
        path: 'user',
        select: '-password -payments',
      });

      return actions;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
