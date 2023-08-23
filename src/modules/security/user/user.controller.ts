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
import { SetPaginatedType } from '../../../helpers/response.decorator'
import { IdRequired } from '../../../helpers/helper.dto'
import {
  logCreateUser,
  logDeleteUser,
  logUpdateUser,
} from '../../../helpers/log.helper'
import { ResponseInterceptor } from '../../../helpers/response.interceptor'
import { getOptionsFromJSON } from '../../../helpers/validation.helper'
import { Paginated, PaginateQueryRaw, UserType } from '../../../types/types'
import { JwtAuthGuard } from '../auth/auth.guard'
import { AllowedUsersGuard } from '../authorization/allowed-user-type.guard'
import { AllowedUsers } from '../authorization/permission.decorator'
import { LogService } from '../log/log.service'
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto
} from './user.dto'
import { UserService } from './user.service'

@Controller('users')
@AllowedUsers(UserType.admin)
@UseGuards(JwtAuthGuard, AllowedUsersGuard)
@UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth('admin')
@ApiTags('admin/user')
export class UserController {
  constructor(
    private readonly service: UserService,
    private readonly logService: LogService,
  ) { }

  @Post()
  public async create(@Body() dto: CreateUserDto, @Req() req: Request): Promise<UserResponseDto> {
    await this.service.isEmailFree(dto.email)

    const obj = await this.service.create(dto)
    await this.logService.create(logCreateUser(req.user, obj.id))
    return obj
  }

  @Put()
  public async update(@Body() dto: UpdateUserDto, @Req() req: Request): Promise<void> {
    if (dto.email) await this.service.isEmailFree(dto.email, dto.id)

    const obj = await this.service.update(dto)
    await this.logService.create(logUpdateUser(req.user, obj.id))
  }

  @Get('/:id')
  public async get(@Param() { id }: IdRequired, @Query() queryOptions: any): Promise<UserResponseDto> {
    const options = getOptionsFromJSON(queryOptions)
    return this.service.getById(id, options)
  }

  @Get()
  @SetPaginatedType(UserResponseDto)
  public async getAll(@Query() query: PaginateQueryRaw): Promise<Paginated<UserResponseDto>> {
    return this.service.getAll(query)
  }

  @Delete('/:id')
  public async delete(@Param() { id }: IdRequired, @Req() req: any): Promise<void> {
    await this.service.deleteById(id)
    await this.logService.create(logDeleteUser(req.user, id))
  }
}
