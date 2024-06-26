import {
  Controller,
  Get,
  Param,
  Query,
  BadRequestException,
  Post,
  Put,
} from '@nestjs/common';
import { ROLE } from 'src/admin/admin.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { UserEntity } from 'src/entity/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/info')
  //@Roles(ROLE.USER)
  findAll(@Query('page') page: number = 1): Promise<UserEntity[]> {
    return this.userService.findAll(page);
  }

  @Get('')
  @Roles(ROLE.USER)
  findOne(
    @Query('nickname') nickname: string,
    @Query('kakaoId') kakaoId?: string,
    @Query('gender') gender?: string,
    @Query('field') field?: string,
    @Query('start') start?: string,
    @Query('end') end?: string,
    @Query('waring') waring?: string,
    @Query('page') page: number = 1,
  ): Promise<UserEntity[]> {
    if (nickname) {
      // 닉네임만 제공되었을 때
      return this.userService.findByNickname(nickname);
    } else if (kakaoId) {
      // 카카오 ID만 제공되었을 때
      return this.userService.findByKakaoId(kakaoId);
    } else if (gender) {
      //성별
      return this.userService.findByGender(gender, page);
      //가입일 or 출생년도
    } else if (start && end) {
      return this.userService.findByDate(field, start, end, page);
    } else if (waring) {
      //경고 횟수
      return this.userService.findByWaringCount(+waring, field, page);
    } else {
      // 입력된 정보가 없을때
      throw new BadRequestException('infomation is not provided.');
    }
  }

  @Get('/findByQueries')
  @Roles(ROLE.USER)
  queries(
    @Query('gender') gender?: string,
    @Query('createdAtField') createdAtField?: string,
    @Query('createdStart') createdStart?: string,
    @Query('createdEnd') createdEnd?: string,
    @Query('warning') waring?: number,
    @Query('warningField') warningField?: string,
    @Query('page') page: number = 1,
    @Query('birthField') birthField?: string,
    @Query('birthStart') birthStart?: string,
    @Query('birthEnd') birthEnd?: string,
  ): Promise<UserEntity[]> {
    return this.userService.findByQueries(
      gender,
      createdAtField,
      createdStart,
      createdEnd,
      +waring,
      warningField,
      page,
      birthField,
      birthStart,
      birthEnd,
    );
  }

  //유저 경고 추가
  @Post('/waring/:userId')
  @Roles(ROLE.USER)
  addWaringCount(@Param('userId') userId: string) {
    return this.userService.addWaringCount(userId);
  }
}
