import { IsBoolean, IsOptional, Length } from 'class-validator'

export class CreateTaskDto {
  @Length(1, 30)
  title: string

  @IsOptional()
  @Length(1, 100)
  description?: string

  @IsOptional()
  @IsBoolean()
  completed?: boolean
}

export class UpdateTaskDto {
  @IsOptional()
  @Length(1, 30)
  title?: string

  @IsOptional()
  @Length(1, 100)
  description?: string

  @IsOptional()
  @IsBoolean()
  completed?: boolean
}

