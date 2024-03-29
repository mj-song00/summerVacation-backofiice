import {
  Controller,
  Get,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ROLE } from 'src/admin/admin.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { DiaryService } from './user.service';

@Controller('diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Get('/info')
  @Roles(ROLE.USER)
  findAll() {
    return this.diaryService.findAll();
  }

  @Get('')
  findOne(
    @Query('nickname') nickname: string,
    @Query('kakaoId') kakaoId?: string,
  ) {
    if (nickname) {
      // 닉네임만 제공되었을 때
      return this.diaryService.findByNickname(nickname);
    } else if (kakaoId) {
      // 닉네임만 제공되었을 때
      return this.diaryService.findByNickname(nickname);
    } else if (kakaoId) {
      // 카카오 ID만 제공되었을 때
      return this.diaryService.findByKakaoId(kakaoId);
    } else {
      // 닉네임과 카카오 ID가 모두 제공되지 않았을 때
      throw new BadRequestException(
        'Neither nickname nor kakaoId is provided.',
      );
    }
  }
}
