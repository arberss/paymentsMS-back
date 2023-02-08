import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getUsers() {
    try {
      const users = await this.userModel.find().select('-password');

      if (!users || users.length < 1) {
        throw new ForbiddenException('Diçka shkoi keq!');
      }

      return users;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
