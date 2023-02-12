import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/guards/role/role.decorator';
import { RolesGuard } from 'src/guards/role/role.guard';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { StatusDto } from './dto/status.dto';
import { StatusesService } from './statuses.service';

@Controller('statuses')
export class StatusesController {
  constructor(private statusService: StatusesService) {}

  @Get()
  getStatuses() {
    return this.statusService.getStatuses();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  addStatus(@Body() { name }: StatusDto) {
    return this.statusService.addStatus({ name });
  }
}
