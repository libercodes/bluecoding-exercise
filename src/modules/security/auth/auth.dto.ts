import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator'
import { User } from '../../../models/user.entity'

export class LoginDto {
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  @Length(6, 30)
  password: string
}

export class ILoginCredentialsDto {
  user: User

  token: string
}
