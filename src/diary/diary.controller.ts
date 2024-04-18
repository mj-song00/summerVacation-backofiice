import { Controller, Get, Param, Query } from '@nestjs/common';
import { ROLE } from 'src/admin/admin.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { Diary } from 'src/entity/diary.entity';
import { DiaryService } from './diary.service';

@Controller('diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Get('/:userId')
  @Roles(ROLE.USER)
  findMonth(
    @Param('userId') userId: string,
    @Query('year') year: string,
    @Query('month') month: string,
    @Query('page') page: number = 1,
  ): Promise<Diary[]> {
    return this.diaryService.findAllDiariesByMonth(+userId, year, month, page);
  }

  @Get('')
  @Roles(ROLE.USER)
  findOne(
    @Query('contents') contents?: string,
    @Query('waringCount') waringCount?: string,
    @Query('field') field?: string,
    @Query('page') page: number = 1,
  ): Promise<Diary[]> {
    if (contents) {
      //내용검색
      return this.diaryService.findByContents(contents, page);
    } else if (waringCount) {
      // 신고 횟수 검색
      return this.diaryService.findByWaringCount(+waringCount, field, page);
    }
  }

  @Get('')
  @Roles(ROLE.USER)
  findAll(): Promise<Diary[]> {
    return this.diaryService.findAllDiaries();
  }
}
