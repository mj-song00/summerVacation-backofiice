import {
  Injectable,
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
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
  ): Promise<any> {
    const take = 10;
    const skip = (page - 1) * take;

    const [diaries, total] = await this.diaryRepository
      .createQueryBuilder('diary')
      .where('diary.userId = :userId', { userId })
      .andWhere('YEAR(diary.date) = :year', { year })
      .andWhere('MONTH(diary.date) = :month', { month })
      .orderBy('diary.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    const lastPage = Math.ceil(total / take);

    if (lastPage >= page) {
      return {
        data: diaries,
        meta: {
          total,
          page,
          last_page: lastPage,
        },
      };
    } else {
      throw new NotFoundException('not exist page');
    }
  }

  async findByContents(contents: string, page: number): Promise<any> {
    const take = 10;
    const skip = (page - 1) * take;

    const [diaries, total] = await this.diaryRepository.findAndCount({
      where: { contents: Like(`%${contents}%`) },
      skip,
      take,
    });

    const lastPage = Math.ceil(total / take);

    if (lastPage >= page) {
      return {
        data: diaries,
        meta: {
          total,
          page,
          last_page: lastPage,
        },
      };
    } else {
      throw new NotFoundException('not exist page');
    }
  }

  async findByWaringCount(
    waringCount: number,
    field: string,
    page: number,
  ): Promise<any> {
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
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const result = await query.skip(skip).take(pageSize).getRawMany();

    if (result.length === 0)
      throw new BadRequestException(`please check field or waring type`);

    // return {
    //   statusCode: HttpStatus.OK,
    //   message: 'success',
    //   data: result,
    // };
  }
}
