import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { Roles } from 'src/guards/role/role.decorator';
import { RolesGuard } from 'src/guards/role/role.guard';
import { IPagination } from 'src/types/pagination';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { ActionsService } from './actions.service';
import { ActionDto } from './dto/actions.dto';

@UseGuards(JwtAuthGuard)
@Controller('actions')
export class ActionsController {
  constructor(private actionService: ActionsService) {}

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post()
  addAction(@Body() dto: ActionDto) {
    return this.actionService.addAction(dto);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get()
  getActions(@Query() paginationQueries: IPagination) {
    return this.actionService.getActions({ pagination: paginationQueries });
  }
}
