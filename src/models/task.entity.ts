import {
  Column,
  Entity,
  ManyToOne,
} from 'typeorm'
import { BaseModel } from './base-model.entity'
import { User } from './user.entity'

@Entity()
export class Task extends BaseModel {
  @Column()
  title: string

  @Column()
  description: string

  @Column({ default: false })
  completed: boolean

  @Column()
  userId: string

  @ManyToOne(() => User)
  user: User
}
