import { UserEntity } from 'src/entity/user.entity';
import { Report } from 'src/entity/report.entity';
import { BookMark } from './entity/mark.entity';
import { Like } from './entity/like.entity';
import { Emotion } from './entity/emotion.like.entity';
import { Diary } from 'src/entity/diary.entity';
import { Admin } from './entity/admin.entity';
import { Image } from './entity/image.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InjectAccountMiddleware } from './middlewares/injectAccount.middleware';
import { DatabaseModule } from './../lib/database/database.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { DiaryModule } from './diary/diary.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [
    DatabaseModule,
    AdminModule,
    UserModule,
    DiaryModule,
    ReportModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
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
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(InjectAccountMiddleware).forRoutes('*');
  }
}
