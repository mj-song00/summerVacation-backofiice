import { Controller, Param, Get } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('')
  getReports() {
    return this.reportService.getReports();
  }
}
