import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { DiaryService } from './diary.service';

@Controller('diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Get('/:userId')
  findAll(
    @Param('userId') userId: string,
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    return this.diaryService.findAllDiaries(+userId, year, month);
  }

  @Get('')
  findOne(@Query('contents') contents?: string, @Query('type') type?: string) {
    if (contents) {
      return this.diaryService.findByContents(contents);
    } else if (type) {
      return this.diaryService.findByType(type);
    }
  }
}
