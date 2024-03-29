import { Injectable, HttpStatus, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Diary } from 'src/entity/diary.entity';
import { Repository } from 'typeorm';

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

    return { statusCode: HttpStatus.OK, message: 'success', data: diaries };
  }

  async findByNickname(nickname: string) {
    const info = await this.diaryRepository
      .createQueryBuilder('diary')
      .leftJoinAndSelect('diary.user', 'user')
      .leftJoinAndSelect('diary.report', 'report')
      .where('user.nickname = :nickname', { nickname: `${nickname}` })
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

    if (info.length === 0)
      throw new BadRequestException(`${nickname} is not exist nickname`);
    return { statusCode: HttpStatus.OK, message: 'success', data: info };
  }

  async findByKakaoId(kakaoId: string) {
    const info = await this.diaryRepository
      .createQueryBuilder('diary')
      .leftJoinAndSelect('diary.user', 'user')
      .leftJoinAndSelect('diary.report', 'report')
      .where('user.nickname = :nickname', { nickname: `${kakaoId}` })
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

    if (info.length === 0)
      throw new BadRequestException(`${kakaoId} is not exist nickname`);
    return { statusCode: HttpStatus.OK, message: 'success', data: info };
  }
}
