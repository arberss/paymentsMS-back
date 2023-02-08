import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/user.schema';
import { AuthDto, SigninAuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    try {
      const user = await this.userModel
        .findOne({
          $or: [{ email: dto.email }, { personalNumber: dto.personalNumber }],
        })
        .select('-password -payments');

      if (user) {
        throw new ForbiddenException('Ky user ekziston');
      }

      if (dto.password !== dto.confirmPassword) {
        throw new ForbiddenException('Passwordet nuk pershtaten');
      }

      const hashedPassword = await bcrypt.hash(dto.password, 12);
      const createdUser = await this.userModel.create({
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        password: hashedPassword,
        personalNumber: dto.personalNumber,
        status: dto.status ? dto.status : null,
        role: dto.role,
      });

      return createdUser;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async signin(dto: SigninAuthDto) {
    const user = await this.userModel.findOne({
      $or: [
        { email: dto.emailOrPersonalNumber },
        { personalNumber: dto.emailOrPersonalNumber },
      ],
    });

    if (!user) {
      throw new ForbiddenException('Ky user nuk ekziston');
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
