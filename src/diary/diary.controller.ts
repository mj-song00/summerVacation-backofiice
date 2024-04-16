import { Controller, Get, Param, Query } from '@nestjs/common';
import { ROLE } from 'src/admin/admin.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { DiaryService } from './diary.service';

@Controller('diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Get('/:userId')
  @Roles(ROLE.USER)
  findAll(
    @Param('userId') userId: string,
    @Query('year') year: string,
    @Query('month') month: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    return this.diaryService.findAllDiaries(
      +userId,
      year,
      month,
      page,
      pageSize,
    );
  }

  @Get('')
  @Roles(ROLE.USER)
  findOne(
    @Query('contents') contents?: string,
    @Query('waringCount') waringCount?: string,
    @Query('field') field?: string,
  ) {
    if (contents) {
      //내용검색
      return this.diaryService.findByContents(contents);
    } else if (waringCount) {
      // 신고 횟수 검색
      return this.diaryService.findByWaringCount(+waringCount, field);
    }
  }
}
