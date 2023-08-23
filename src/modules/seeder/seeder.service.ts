import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { UserService } from '../security/user/user.service'
import * as dotenv from 'dotenv'
import { User } from '../../models/user.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

dotenv.config()

const { ENV } = process.env

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  private readonly password = 'Test123456'

  private readonly logger = new Logger(SeederService.name)

  private hashedPassword: string

  constructor(
    private readonly userService: UserService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  async onApplicationBootstrap() {
    await this.seed(ENV)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async seed(env: string) {
    this.hashedPassword = await this.userService.hashPassword(this.password)
    await this.seedAdminUser()
  }

  private async seedAdminUser(): Promise<User | undefined> {
    const existingAdminUser = await this.userRepo.findOne({ where: { type: 'admin' } })
    if (existingAdminUser) return

    const user = new User()
    user.fullName = 'Admin'
    user.email = 'admin@system.com'
    user.password = this.hashedPassword
    user.type = 'admin'

    this.logger.log(`[ADMIN ACCOUNT] \nemail: ${user.email} \npassword: ${this.password} \nPlease change it ASAP`)

    return user.save()
  }
}