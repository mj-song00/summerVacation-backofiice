import { Module } from '@nestjs/common';
import { DiaryService } from './user.service';
import { DiaryController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diary } from 'src/entity/diary.entity';

@Module({
  controllers: [DiaryController],
  providers: [DiaryService],
  imports: [TypeOrmModule.forFeature([Diary])],
})
export class UserModule {}
