/* eslint-disable max-len */
import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { User } from '../../../models/user.entity'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { plainToClass } from 'class-transformer'
import { ResetPasswordToken, UserType } from '../../../types/types'
import { UserService } from '../user/user.service'
import {
  ILoginCredentialsDto,
  LoginDto,
} from './auth.dto'
import { IJwtPayload } from './auth.interface'
import { errorsCatalogs } from '../../../catalogs/errors-catalogs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SignUpUserDto } from '../user/user.dto'

const {
  EMAIL_OR_PASSWORD_INVALID,
  USER_EMAIL_ALREADY_EXISTS
} = errorsCatalogs


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) { }

  private generateJWTPayload(user: User): IJwtPayload {
    return {
      id: user.id,
      createdAt: new Date()
    }
  }

  public async adminLogin(dto: LoginDto): Promise<ILoginCredentialsDto> {
    const { email, password } = dto

    let foundUser: User
    try {
      foundUser = await this.userService.getByEmail(email, {})
    } catch (error) {
      throw new UnauthorizedException(EMAIL_OR_PASSWORD_INVALID)
    }

    if (foundUser.type !== UserType.admin) {
      throw new UnauthorizedException(EMAIL_OR_PASSWORD_INVALID)
    }

    const isPasswordValid: boolean = await bcrypt.compare(password, foundUser.password)
    if (!isPasswordValid) throw new UnauthorizedException(EMAIL_OR_PASSWORD_INVALID)

    return this.generateLoginCredentials(foundUser)
  }

  public async login(dto: LoginDto): Promise<ILoginCredentialsDto> {
    const { email, password } = dto

    let foundUser: User
    try {
      foundUser = await this.userService.getByEmail(email, {})
    } catch (error) {
      throw new UnauthorizedException(EMAIL_OR_PASSWORD_INVALID)
    }

    const isPasswordValid: boolean = await bcrypt.compare(password, foundUser.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException(EMAIL_OR_PASSWORD_INVALID)
    }

    return this.generateLoginCredentials(foundUser)
  }

  public async signup(dto: SignUpUserDto): Promise<ILoginCredentialsDto> {
    const { fullName, email, password } = dto

    const existingUser = await this.userRepository.findOne({ where: { email } })
    if (existingUser) {
      throw new UnauthorizedException(USER_EMAIL_ALREADY_EXISTS)
    }

    const newUser = await this.userService.create({
      fullName,
      email,
      password,
      type: 'user'
    })

    return this.generateLoginCredentials(newUser)
  }

  public async generateTokenForNewUser(user: User): Promise<string> {
    const token: ResetPasswordToken = { userId: user.id }
    return this.jwtService.sign(token)
  }

  private generateLoginCredentials(foundUser: User): ILoginCredentialsDto {
    const payload = this.generateJWTPayload(foundUser)
    const token = this.jwtService.sign(payload)

    const user = plainToClass(User, foundUser)

    return { user, token }
  }

  public verifyToken(token: string): any {
    return this.jwtService.verify(token)
  }
}
