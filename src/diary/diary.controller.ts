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
  ) {
    return this.diaryService.findAllDiaries(+userId, year, month);
  }

  @Get('')
  @Roles(ROLE.USER)
  findOne(@Query('contents') contents?: string, @Query('type') type?: string) {
    if (contents) {
      return this.diaryService.findByContents(contents);
    } else if (type) {
      return this.diaryService.findByType(type);
    }
  }
}
