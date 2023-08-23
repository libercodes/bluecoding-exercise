import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SecurityModule } from '../security/security.module'
import { TaskService } from './task.service'
import { TasksController } from './task.controller'
import { Task } from '../../models/task.entity'


@Module({
  imports: [
    SecurityModule,
    TypeOrmModule.forFeature([
      Task,
    ]),
  ],
  providers: [
    TaskService
  ],
  exports: [
    TasksController
  ]
})
export class TaskModule { }
