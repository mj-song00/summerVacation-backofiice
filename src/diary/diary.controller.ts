import { Controller, Get, Param } from '@nestjs/common';
import { ROLE } from 'src/admin/admin.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { DiaryService } from './diary.service';

@Controller('diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Get('/info')
  @Roles(ROLE.USER)
  findAll() {
    return this.diaryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.diaryService.findOne(+id);
  }
}
