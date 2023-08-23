import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as dotenv from 'dotenv'
import { ScheduleModule } from '@nestjs/schedule'
import { dbConfig } from './config/database'
import { RequestLoggerMiddleware } from './middlewares/request-logger.middleware'
import { SecurityModule } from './modules/security/security.module'
import { SeederModule } from './modules/seeder/seeder.module'
import { TaskModule } from './modules/task/task.module'


dotenv.config()

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    ScheduleModule.forRoot(),
    SecurityModule,
    SeederModule,
    TaskModule
  ],
  controllers: [],
  providers: [],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware)
      .forRoutes('*')
  }
}
