import 'reflect-metadata'
import { Type } from 'class-transformer'

export interface PaginateQueryRaw {
  page?: string,
  take?: string,
  search?: string
  order?: string
}

export interface CoursePaginateQueryRaw extends PaginateQueryRaw {
  category_name?: string,
  sortOrder?: 'ASC' | 'DESC'
  category_id?: string
}

export interface Metadata {
  totalPages: number
  totalItems: number
  itemsPerPage: number
  currentPage: number
}

export class Paginated<T> {
  // eslint-disable-next-line
  constructor(private type?: Function) { }

  @Type((options) => (options.newObject as Paginated<T>).type)
  rows: T[]

  metadata: Metadata
}

export class Response<T> {
  status: boolean

  message?: string

  data: T
}

export interface ResetPasswordToken {
  userId: string
}

export enum EnumBannedTokenType {
  RESET_PASSWORD = 'RESET_PASSWORD',
  AUTH = 'AUTH'
}

export enum EnumAction {
  create = 'create',
  update = 'update',
  delete = 'delete',
  signup = 'signup',
  password_reset = 'password_reset',
}

export enum EnumResource {
  user = 'account',
}

export enum UserType {
  admin = 'admin',
  user = 'user'
}

export type UserTypes = 'admin' | 'user'

export enum GenderType {
  male = 'male',
  female = 'female'
}

export type GenderTypes = 'male'
  | 'female'

export class UpdateImageResDto {
  imageUrl: string

  id: string
}