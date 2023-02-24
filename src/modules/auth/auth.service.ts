import { Status, StatusDocument } from 'src/schema/status.schema';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/user.schema';
import { AuthDto, SigninAuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Payment, PaymentDocument } from 'src/schema/payment.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(Status.name) private statusModel: Model<StatusDocument>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    try {
      const user = await this.userModel
        .findOne({
          $or: [{ personalNumber: dto.personalNumber }, { email: dto.email }],
        })
        .select('-password -payments');

      if (user) {
        throw new ForbiddenException('Ky user ekziston');
      }

      if (dto.password !== dto.confirmPassword) {
        throw new ForbiddenException('Passwordet nuk pershtaten');
      }

      let hashedPassword: string;
      if (dto.password) {
        hashedPassword = await bcrypt.hash(dto.password, 12);
      }
      const createdUser = await this.userModel.create({
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        password: hashedPassword,
        personalNumber: dto.personalNumber,
        status: dto.status,
        role: dto.role !== '' ? dto.role : 'user',
      });

      const userPayment = await this.paymentModel.create({
        user: createdUser._id,
        payments: [],
      });

      await this.userModel.updateOne(
        { _id: createdUser._id },
        { payments: userPayment._id },
      );

      await this.statusModel.findByIdAndUpdate(createdUser.status, {
        $push: {
          users: createdUser._id,
        },
      });

      return createdUser;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async signin(dto: SigninAuthDto) {
    try {
      const user = await this.userModel.findOne({
        $or: [
          { email: dto.emailOrPersonalNumber },
          { personalNumber: dto.emailOrPersonalNumber },
        ],
      });

      if (!user) {
        throw new ForbiddenException('Ky user nuk ekziston');
      }

      if (user && !user.password) {
        throw new ForbiddenException('Ky user nuk eshte aktiv');
      }

      const isPasswordValid = await bcrypt.compare(dto.password, user.password);
      if (!isPasswordValid) {
        throw new ForbiddenException('Password nuk eshte i sakt');
      }

      const token = await this.signToken({
        id: user._id.toString(),
        email: user.email,
        personalNumber: user.personalNumber,
        role: user.role,
      });

      return {
        id: user._id.toString(),
        token: token.access_token,
      };
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async signToken({
    id,
    email,
    personalNumber,
    role,
  }: {
    id: string;
    email: string;
    personalNumber: string;
    role: string;
  }): Promise<{ access_token: string }> {
    const token = this.jwtService.sign(
      { id, email, role, personalNumber },
      {
        expiresIn: '240m',
        secret: this.config.get('JWT_SECRET'),
      },
    );

    return { access_token: token };
  }
}
