import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { FindOneOptions, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Task } from '../../models/task.entity'
import { CreateTaskDto, UpdateTaskDto } from './task.dto'
import { PaginateQueryRaw, Paginated } from '../../types/types'
import { errorsCatalogs } from '../../catalogs/errors-catalogs'
import { GetAllPaginatedQB } from '../../helpers/pagination.helper'

const {
  TASK_NOT_FOUND,
} = errorsCatalogs

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly repository: Repository<Task>,
  ) { }

  public async getById(id: string): Promise<Task> {
    const obj = await this.repository.findOne(({
      where: { id }
    }))
    if (!obj) throw new NotFoundException(TASK_NOT_FOUND)
    return obj
  }

  public async getOne(options: FindOneOptions<Task>): Promise<Task> {
    const obj = await this.repository.findOne(options)
    if (!obj) throw new NotFoundException(TASK_NOT_FOUND)
    return obj
  }

  public async getAll(query: PaginateQueryRaw): Promise<Paginated<Task>> {
    const qb = this.repository.createQueryBuilder('task')

    if (query.search) {
      qb.andWhere(`LOWER(task.title) Like '%${query.search.toLowerCase()}%'`)
    }

    return GetAllPaginatedQB(qb, query)
  }

  public async create(dto: CreateTaskDto, userId: string): Promise<Task> {
    const obj = this.repository.create({ ...dto, userId })
    return obj.save()
  }

  public async update(id: string, dto: UpdateTaskDto, userId: string): Promise<Task> {
    const obj = await this.getById(id)
    if (obj.userId !== userId) {
      throw new UnauthorizedException()
    }

    return this.repository.save({
      ...obj,
      ...dto
    })
  }

  public async deleteById(id: string, userId: string): Promise<void> {
    const obj = await this.getById(id)

    if (obj.userId !== userId) {
      throw new UnauthorizedException()
    }
    const result = await this.repository.softDelete(id)
    if (result.affected === 0) throw new NotFoundException(TASK_NOT_FOUND)
  }
}
