import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { UsersService } from '../core/services/users.service';
import { AuthGuard } from '@nestjs/passport';
import { ShowUserDTO } from '../models/users/show-user.dto';

@UseGuards(AuthGuard())
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':username')
  async findUser(@Param('username') username: string): Promise<ShowUserDTO> {
    return await this.usersService.findUserByUsername(username);
  }

}
