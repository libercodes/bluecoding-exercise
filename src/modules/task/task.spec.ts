import { v4 } from 'uuid'
import { Repository } from 'typeorm'
import { TaskService } from './task.service'
import { Task } from '../../models/task.entity'
import { TestingDB } from '../../config/testing-db'
import { User } from '../../models/user.entity'
import { CreateTaskDto, UpdateTaskDto } from './task.dto'
import { PaginateQueryRaw } from '../../types/types'

describe('TaskService', () => {
  let service: TaskService
  let repo: Repository<Task>
  let task: Task
  let user: User

  beforeAll(async () => {
    const db = TestingDB.getInstance()
    const conn = await db.initialize()

    repo = conn.getRepository(Task)
    const userRepo = conn.getRepository(User)
    service = new TaskService(repo)

    user = await userRepo.create({
      email: 'asd@mail.com',
      password: 'asd12334@',
      fullName: 'asd',
      type: 'user',
    }).save()
  })

  describe('create', () => {
    it('should create a task', async () => {
      const dto: CreateTaskDto = {
        title: 'Task 1',
        description: 'Simple description',
        completed: false
      }

      const res = await service.create(dto, user.id)
      task = res

      expect(res).toHaveProperty('id')
      expect(res.title).toEqual(dto.title)
      expect(res.description).toEqual(dto.description)
      expect(res.completed).toEqual(dto.completed)
    })
  })

  describe('getAll', () => {
    it('should get all tasks', async () => {
      const query: PaginateQueryRaw = {}
      const res = await service.getAll(query)
      expect(Array.isArray(res.rows)).toBe(true)
      expect(res.metadata.currentPage).toBe(1)
    })
  })

  describe('getById', () => {
    it('should throw an error if task with id was not found', async () => {
      const id = v4()
      await expect(service.getById(id)).rejects.toThrow()
    })

    it('should get a task by id', async () => {
      const res = await service.getById(task.id)
      expect(res.id).toBe(task.id)
    })
  })

  describe('update', () => {
    it('Should update an existing task', async () => {
      const dto: UpdateTaskDto = {
        title: 'updated task',
        description: 'desc',
        completed: true
      }

      const res = await service.update(task.id, dto, user.id)

      expect(res.id).toBe(task.id)
      expect(res.title).toBe(dto.title)
      expect(res.description).toBe(dto.description)
      expect(res.completed).toBe(dto.completed)
    })

    it('Should throw an error if the task does not belong to the user', async () => {
      const dto: UpdateTaskDto = {
        title: 'updated task',
        description: 'desc',
        completed: true
      }
      const fakeUserId = v4()

      await expect(service.update(task.id, dto, fakeUserId)).rejects.toThrow()
    })
  })


  describe('deleteById', () => {
    it('should throw an error if the task was not found', async () => {
      await expect(service.deleteById(v4(), user.id)).rejects.toThrow()
    })
    it('should throw an error if the task does not belong to the given user', async () => {
      await expect(service.deleteById(task.id, v4())).rejects.toThrow()
    })
    it('should delete the task with the given id', async () => {
      await expect(service.deleteById(task.id, user.id)).resolves.not.toThrow()
    })
  })
})