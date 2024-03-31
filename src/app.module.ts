import { InjectAccountMiddleware } from './middlewares/injectAccount.middleware';
import { DatabaseModule } from './../lib/database/database.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { DiaryModule } from './diary/diary.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [
    AdminModule,
    UserModule,
    DiaryModule,
    ReportModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(InjectAccountMiddleware).forRoutes('*');
  }
}
