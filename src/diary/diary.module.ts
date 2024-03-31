import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { DiaryController } from './diary.controller';
import { Diary } from 'src/entity/diary.entity';
import { UserEntity } from 'src/entity/user.entity';

@Module({
  controllers: [DiaryController],
  providers: [DiaryService],
  imports: [TypeOrmModule.forFeature([Diary, UserEntity])],
})
export class DiaryModule {}
