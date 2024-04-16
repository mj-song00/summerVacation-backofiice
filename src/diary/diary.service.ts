import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Diary } from 'src/entity/diary.entity';
import { UserEntity } from 'src/entity/user.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async findAllDiaries(
    userId: number,
    year: string,
    month: string,
    page: number,
    pageSize: number,
  ) {
    const skip = (page - 1) * pageSize;

    const diaries = await this.diaryRepository
      .createQueryBuilder('diary')
      .where('diary.userId = :userId', { userId })
      .andWhere('YEAR(diary.date) = :year', { year })
      .andWhere('MONTH(diary.date) = :month', { month })
      .orderBy('diary.createdAt', 'DESC')
      .skip(skip)
      .take(pageSize)
      .getRawMany();

    if (diaries.length === 0)
      throw new BadRequestException('please check userId, year and month');

    return { statusCode: HttpStatus.OK, message: 'success', data: diaries };
  }

  async findByContents(contents: string) {
    const diaries = await this.diaryRepository.find({
      where: { contents: Like(`%${contents}%`) },
    });
    if (diaries.length === 0)
      throw new BadRequestException('please check contents');
    return { statusCode: HttpStatus.OK, message: 'success', data: diaries };
  }

  async findByWaringCount(waringCount: number, field: string) {
    let query = this.diaryRepository.createQueryBuilder('diary');

    if (field === 'LessThanOrEqual') {
      query = query.where('diary.waringCount <= :waringCount ', {
        waringCount,
      });
    } else if (field === 'MoreThanOrEqual') {
      query = query.where('diary.waringCount >= :waringCount ', {
        waringCount,
      });
    } else if (field === 'Equal') {
      query = query.where('diary.waringCount = :waringCount ', { waringCount });
    } else {
      throw new BadRequestException('Invalid field name');
    }

    const result = await query.getRawMany();

    if (result.length === 0)
      throw new BadRequestException(`please check field or waring type`);

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data: result,
    };
  }
}
