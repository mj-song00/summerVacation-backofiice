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
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/info')
  @Roles(ROLE.USER)
  findAll() {
    return this.userService.findAll();
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
  ) {
    if (nickname) {
      // 닉네임만 제공되었을 때
      return this.userService.findByNickname(nickname);
    } else if (kakaoId) {
      // 카카오 ID만 제공되었을 때
      return this.userService.findByKakaoId(kakaoId);
    } else if (gender) {
      //성별
      return this.userService.findByGender(gender);
      //가입일 or 출생년도
    } else if (start && end) {
      return this.userService.findByDate(field, start, end);
    } else if (waring) {
      //경고 횟수
      return this.userService.findByWaringCount(+waring, field);
    } else {
      // 입력된 정보가 없을때
      throw new BadRequestException('infomation is not provided.');
    }
  }

  @Get('/findByQueries')
  @Roles(ROLE.USER)
  queries(
    @Query('gender') gender?: string,
    @Query('field') field?: string,
    @Query('start') start?: string,
    @Query('end') end?: string,
    @Query('waring') waring?: number,
    @Query('waringField') waringField?: string,
  ) {
    return this.userService.findByQueries(
      gender,
      field,
      start,
      end,
      +waring,
      waringField,
    );
  }

  //유저 경고 추가
  @Post('/waring/:userId')
  @Roles(ROLE.USER)
  addWaringCount(@Param('userId') userId: string) {
    return this.userService.addWaringCount(userId);
  }
}
