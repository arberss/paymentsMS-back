import { Controller, Get } from '@nestjs/common';
import { StatusesService } from './statuses.service';

@Controller('statuses')
export class StatusesController {
  constructor(private statusService: StatusesService) {}

  @Get()
  getStatuses() {
    return this.statusService.getStatuses();
  }
}
