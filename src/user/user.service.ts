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
      throw new NotFoundException('해당 페이지는 존재하지 않습니다');
    }
  }

  async findByNickname(nickname: string) {
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

  async findByKakaoId(kakaoId: string) {
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

  async findByGender(gender: string) {
    const findByGender = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.report', 'report')
      .where('user.gender =:gender', { gender: `${gender}` })
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

    if (findByGender.length === 0)
      throw new BadRequestException(`${gender} is not exist`);

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data: findByGender,
    };
  }

  async findByDate(field: string, start: string, end: string) {
    const startDate = new Date(start);
    const endDate = new Date(end);

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
      .groupBy('user.id');

    if (field === 'createdAt') {
      query = query.where('user.createdAt BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      });
    } else if (field === 'birth') {
      query = query.where('user.birth BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      });
    } else {
      throw new BadRequestException('Invalid field name');
    }

    const result = await query.getRawMany();

    if (result.length === 0)
      throw new BadRequestException(`please check start or end type`);

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data: result,
    };
  }

  async findByWaringCount(waring: number, field: string) {
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

    const result = await query.getRawMany();

    if (result.length === 0)
      throw new BadRequestException(`please check field or waring type`);

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data: result,
    };
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
    gender: string,
    field: string,
    start: string,
    end: string,
    waring: number,
    waringField: string,
  ) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    let query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.report', 'report')
      .where('user.gender = :gender', { gender: `${gender}` })
      .andWhere(
        field === 'createdAt'
          ? 'user.createdAt BETWEEN :start AND :end'
          : 'user.birth BETWEEN :start AND :end',
        {
          start: startDate,
          end: endDate,
        },
      )
      .andWhere(
        waringField === 'LessThanOrEqual'
          ? 'user.waring <= :waring'
          : waringField === 'MoreThanOrEqual'
            ? 'user.waring >= :waring'
            : waringField === 'Equal'
              ? 'user.waring = :waring'
              : null,
        { waring },
      );

    if (field !== 'createdAt' && field !== 'birth') {
      throw new BadRequestException('Invalid field name');
    }

    if (
      waringField !== 'LessThanOrEqual' &&
      waringField !== 'MoreThanOrEqual' &&
      waringField !== 'Equal'
    ) {
      throw new BadRequestException('Invalid field name');
    }

    const result = await query.getMany();
    if (result.length === 0)
      throw new BadRequestException('please check queries');

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data: result,
    };
  }
}
