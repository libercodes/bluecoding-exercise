import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { JwtAuthGuard } from '../security/auth/auth.guard'
import { ResponseInterceptor } from '../../helpers/response.interceptor'
import { CreateTaskDto, UpdateTaskDto } from './task.dto'
import { Task } from '../../models/task.entity'
import { IdRequired } from '../../helpers/helper.dto'
import { PaginateQueryRaw, Paginated } from '../../types/types'
import { SetPaginatedType } from '../../helpers/response.decorator'
import { TaskService } from './task.service'
import { User } from '../../models/user.entity'

@Controller('tasks')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth('user')
@ApiTags('tasks')
export class TasksController {
  constructor(
    private readonly service: TaskService,
  ) { }

  @Post()
  public async create(@Body() dto: CreateTaskDto, @Req() req: Request): Promise<Task> {
    const user = req.user as User
    const obj = await this.service.create(dto, user.id)
    return obj
  }

  @Put('/:id')
  public async update(
    @Body() dto: UpdateTaskDto,
    @Req() req: Request,
    @Param() { id }: IdRequired
  ): Promise<void> {
    const user = req.user as User

    await this.service.update(id, dto, user.id)
  }

  @Get('/:id')
  public async get(@Param() { id }: IdRequired): Promise<Task> {
    return this.service.getById(id)
  }

  @Get()
  @SetPaginatedType(Task)
  public async getAll(@Query() query: PaginateQueryRaw): Promise<Paginated<Task>> {
    return this.service.getAll(query)
  }

  @Delete('/:id')
  public async delete(@Param() { id }: IdRequired, @Req() req: Request): Promise<void> {
    const user = req.user as User
    await this.service.deleteById(id, user.id)
  }
}
