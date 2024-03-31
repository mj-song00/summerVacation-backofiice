import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportService {
  update(id: number) {
    return `This action updates a #${id} report`;
  }
}
