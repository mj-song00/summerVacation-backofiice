import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Diary } from 'src/entity/diary.entity';
import { Repository } from 'typeorm';
import { UpdateDiaryDto } from './dto/update-diary.dto';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
  ) {}

  async findAll() {
    const diaries = await this.diaryRepository
      .createQueryBuilder('diary')
      .leftJoinAndSelect('diary.user', 'user')
      .leftJoinAndSelect('diary.report', 'report')
      .select([
        'diary.id',
        'diary.title',
        'diary.contents',
        'diary.date',
        'diary.emotion',
        'diary.weather',
        'diary.isWrite',
        'diary.isPublic',
        'diary.imageUrl',
        'diary.createdAt',
        'user.id',
        'user.kakaoId',
        'user.image',
        'user.nickname',
        'user.gender',
        'user.birth',
        'user.waring',
        'user.createdAt',
        'COUNT(report.id) AS reportCount',
      ])
      .groupBy('diary.id')
      .getRawMany();

    return diaries;
  }

  findOne(id: number) {
    return `This action returns a #${id} diary`;
  }
}
