import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../core/services/users.service';
import { UserLoginDTO } from '../models/users/user-login.dto';
import { ShowUserDTO } from '../models/users/show-user.dto';
import { UserRegisterDTO } from '../models/users/user-register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(user: UserLoginDTO): Promise<{user: ShowUserDTO, token: string}> {
    const userFound = await this.usersService.findUserByEmail(user.email);

    const token = await this.jwtService.sign({email: userFound.email});

    return { user: userFound, token };
  }

  async register(user: UserRegisterDTO): Promise<ShowUserDTO> {
    return await this.usersService.register(user);
  }

  async validateIfUserExists(email: string): Promise<ShowUserDTO> | undefined {
    return await this.usersService.findUserByEmail(email);
  }

  async validateUserPassword(user: UserLoginDTO): Promise<boolean> {
    return await this.usersService.validateUserPassword(user);
  }
}
