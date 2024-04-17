import { Controller, Param, Get, Post, Query } from '@nestjs/common';
import { ReportService } from './report.service';
import { Roles } from 'src/decorators/roles.decorator';
import { ROLE } from 'src/admin/admin.enum';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('')
  @Roles(ROLE.USER)
  getReports(@Query('page') page: number = 1) {
    return this.reportService.getReports(page);
  }
}
