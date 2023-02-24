import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/guards/role/role.decorator';
import { RolesGuard } from 'src/guards/role/role.guard';
import { FilterPayments } from 'src/types/filter';
import { IPagination } from 'src/types/pagination';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { PaymentDto } from './dto/management.dto';
import { ManagementService } from './management.service';

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class ManagementController {
  constructor(private paymentService: ManagementService) {}

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Put(':userId')
  addPayment(@Param('userId') userId, @Body() dto: PaymentDto) {
    return this.paymentService.addPayment(dto, userId);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Put('delete/:paymentId')
  deletePayment(@Param('paymentId') paymentId) {
    return this.paymentService.deletePayment(paymentId);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Put(':userId/:paymentId')
  editPayment(@Param() params, @Body() dto: PaymentDto) {
    return this.paymentService.editPayment(dto, params);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post(':userId?')
  getPayments(
    @Query() paginationQueries: IPagination,
    @Param('userId') userId?,
    @Body() payload?: FilterPayments,
  ) {
    return this.paymentService.getPayments(paginationQueries, userId, payload);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get(':userId?/:paymentId')
  getPayment(@Param() params) {
    return this.paymentService.getPayment(params);
  }
}
