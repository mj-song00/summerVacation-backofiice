import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from 'src/entity/report.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}
  async getReports(page: number) {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const reports = await this.reportRepository.find({
      relations: {
        user: true,
        faq: true,
      },
      skip: skip,
      take: pageSize,
    });

    if (reports.length === 0)
      throw new BadRequestException('report is not exist');

    return reports;
  }
}
