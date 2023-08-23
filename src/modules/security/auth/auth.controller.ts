import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Req,
  UseInterceptors
} from '@nestjs/common'
import { ResponseInterceptor } from '../../../helpers/response.interceptor'
import {
  ILoginCredentialsDto,
  LoginDto,
} from './auth.dto'
import { AuthService } from './auth.service'
import { SignUpUserDto } from '../user/user.dto'

@Controller('auth')
@UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly service: AuthService) { }

  @Post('/admin/login')
  public async adminLogin(@Body() dto: LoginDto): Promise<ILoginCredentialsDto> {
    return this.service.adminLogin(dto)
  }

  @Post('/login')
  public async login(@Body() dto: LoginDto): Promise<ILoginCredentialsDto> {
    return this.service.login(dto)
  }

  @Post('/signup')
  public async signup(@Req() req: Request, @Body() dto: SignUpUserDto): Promise<ILoginCredentialsDto> {
    const token = await this.service.signup(dto)
    return token
  }
}
