import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from 'src/entity/admin.entity';
import { Category } from 'src/entity/category.enitity';
import { Diary } from 'src/entity/diary.entity';
import { Emotion } from 'src/entity/emotion.like.entity';
import { Faq } from 'src/entity/faq.entity';
import { Image } from 'src/entity/image.entity';
import { Like } from 'src/entity/like.entity';
import { BookMark } from 'src/entity/mark.entity';
import { Report } from 'src/entity/report.entity';
import { UserEntity } from 'src/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [
          Admin,
          Diary,
          Emotion,
          Image,
          Like,
          BookMark,
          Report,
          UserEntity,
          Faq,
          Category,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
