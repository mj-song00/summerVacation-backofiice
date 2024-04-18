import { UserEntity } from 'src/entity/user.entity';
import {
  Injectable,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(page: number = 1): Promise<any> {
    const take = 10;
    const [users, total] = await this.userRepository.findAndCount({
      take,
      skip: (page - 1) * take,
    });
    if (users.length === 0) throw new BadRequestException('bad request');
    const last_page = Math.ceil(total / take);

    if (last_page >= page) {
      return {
        data: users,
        meta: {
          total,
          page,
          last_page: last_page,
        },
      };
    } else {
      throw new NotFoundException('not exist page');
    }
  }

  async findByNickname(nickname: string): Promise<any> {
    const findByNickname = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.report', 'report')
      .where('user.nickname = :nickname', { nickname: `${nickname}` })
      .select([
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
      .groupBy('user.id')
      .getRawMany();

    if (findByNickname.length === 0)
      throw new BadRequestException(`${nickname} is not exist nickname`);
    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data: findByNickname,
    };
  }

  async findByKakaoId(kakaoId: string): Promise<any> {
    const info = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.report', 'report')
      .where('user.kakaoId = :kakaoId', { kakaoId: `${kakaoId}` })
      .select([
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
      .groupBy('user.id')
      .getRawMany();

    if (info.length === 0)
      throw new BadRequestException(`${kakaoId} is not exist nickname`);
    return { statusCode: HttpStatus.OK, message: 'success', data: info };
  }

  async findByGender(gender: string, page: number = 1): Promise<any> {
    const take = 10;

    const [users, total] = await this.userRepository.findAndCount({
      relations: {
        report: true,
      },
      where: {
        gender: `${gender}`,
      },
      take,
      skip: (page - 1) * take,
    });

    if (users.length === 0)
      throw new BadRequestException(`please check ${gender}`);

    const last_page = Math.ceil(total / take);

    if (last_page >= page) {
      return {
        data: users,
        meta: {
          total,
          current_page: page,
          last_page,
        },
      };
    } else {
      throw new NotFoundException('not exist page');
    }
  }

  async findByDate(
    field: string,
    start: string,
    end: string,
    page: number = 1,
  ): Promise<any> {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const take = 10;
    const [users, total] = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.report', 'report')
      .where(`user.${field} >= :start`, {
        start: startDate,
      })
      .andWhere(`user.${field} <= :end`, {
        end: endDate,
      })
      .skip((page - 1) * take)
      .take(take)
      .getManyAndCount();

    if (users.length === 0)
      throw new BadRequestException(`please check field or start or end`);

    const lastPage = Math.ceil(total / take);

    if (lastPage >= page) {
      return {
        data: users,
        meta: {
          total,
          current_page: page,
          lastPage,
        },
      };
    } else {
      throw new NotFoundException('not exist page');
    }
  }

  async findByWaringCount(
    waring: number,
    field: string,
    page: number,
  ): Promise<any> {
    const take = 10; // 페이지당 항목 수
    const skip = (page - 1) * take; // 건너뛸 항목 수

    let query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.report', 'report')
      .select([
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
      .skip(skip)
      .take(take)
      .groupBy('user.id');

    if (field === 'LessThanOrEqual') {
      query = query.where('user.waring <= :waring', { waring });
    } else if (field === 'MoreThanOrEqual') {
      query = query.where('user.waring >= :waring', { waring });
    } else if (field === 'Equal') {
      query = query.where('user.waring = :waring', { waring });
    } else {
      throw new BadRequestException('Invalid field name');
    }

    const [users, total] = await query.getManyAndCount(); // 결과와 총 항목 수를 가져옴

    if (users.length === 0)
      throw new BadRequestException(`please check field or waring`);
    const lastPage = Math.ceil(total / take); // 마지막 페이지 계산

    if (lastPage >= page) {
      return {
        data: users,
        meta: {
          total,
          current_page: page,
          lastPage,
        },
      };
    } else {
      throw new NotFoundException('not exist page');
    }
  }

  async addWaringCount(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (user === null) throw new BadRequestException('please check userId');

    user.waring += 1;
    await this.userRepository.save(user);

    return { statusCode: HttpStatus.OK, message: 'success' };
  }

  async findByQueries(
    gender?: string,
    createdAtField?: string,
    createdStart?: string,
    createdEnd?: string,
    warning?: number,
    warningField?: string,
    page?: number,
    birthField?: string,
    birthStart?: string,
    birthEnd?: string,
  ): Promise<any> {
    const take = 10;
    const skip = (page - 1) * take;

    let query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.report', 'report')
      .select([
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
      .skip(skip)
      .take(take)
      .groupBy('user.id');

    if (createdAtField === 'createdAt' && createdStart && createdEnd) {
      query = query.andWhere('user.createdAt BETWEEN :start AND :end', {
        start: createdStart,
        end: createdEnd,
      });
    } else if (birthField === 'birth' && birthStart && birthEnd) {
      query = query.andWhere('user.birth BETWEEN :start AND :end', {
        start: birthStart,
        end: birthEnd,
      });
    }

    if (gender) {
      query = query.andWhere('user.gender = :gender', { gender });
    }

    if (
      warningField &&
      ['LessThanOrEqual', 'MoreThanOrEqual', 'Equal'].includes(warningField) &&
      warning
    ) {
      if (warningField === 'LessThanOrEqual') {
        query = query.andWhere('user.waring <= :waring', { waring: warning });
      } else if (warningField === 'MoreThanOrEqual') {
        query = query.andWhere('user.waring >= :waring', { waring: warning });
      } else if (warningField === 'Equal') {
        query = query.andWhere('user.waring = :waring', { waring: warning });
      }
    }

    const [users, total] = await query.getManyAndCount();

    const last_page = Math.ceil(total / take);

    return {
      data: users,
      meta: {
        total,
        current_page: page || 1,
        last_page,
      },
    };
  }
}
