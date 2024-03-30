import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { DiaryController } from './diary.controller';
import { Diary } from 'src/entity/diary.entity';

@Module({
  controllers: [DiaryController],
  providers: [DiaryService],
  imports: [TypeOrmModule.forFeature([Diary])],
})
export class DiaryModule {}
