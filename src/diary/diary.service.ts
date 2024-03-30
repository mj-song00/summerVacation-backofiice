import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Diary } from 'src/entity/diary.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
  ) {}
  async findAllDiaries(userId: number, year: string, month: string) {
    const diaries = await this.diaryRepository
      .createQueryBuilder('diary')
      .where('diary.userId = :userId', { userId })
      .andWhere('YEAR(diary.date) = :year', { year })
      .andWhere('MONTH(diary.date) = :month', { month })
      .orderBy('diary.createdAt', 'DESC')
      .getRawMany();

    if (diaries.length === 0)
      throw new BadRequestException('please check userId, year and month');

    return { statusCode: HttpStatus.OK, message: 'success', data: diaries };
  }

  findOne(id: number) {
    return `This action returns a #${id} diary`;
  }
}
