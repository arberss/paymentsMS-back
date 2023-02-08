import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from 'src/guards/role/role.decorator';
import { RolesGuard } from 'src/guards/role/role.guard';
import { GetUser } from '../auth/decorator/getUser.decorator';
import { AuthDto } from '../auth/dto/auth.dto';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  me(@GetUser() user: AuthDto) {
    return user;
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get('/all')
  getUsers() {
    return this.userService.getUsers();
  }
}
