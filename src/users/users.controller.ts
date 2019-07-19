import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { UsersService } from '../core/services/users.service';
import { AuthGuard } from '@nestjs/passport';
import { ShowUserDTO } from '../models/users/show-user.dto';

@UseGuards(AuthGuard())
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findSingleUser(@Param('id') id: string): Promise<ShowUserDTO> {
    return await this.usersService.findUserById(id);
  }

  @Get(':username')
  async findUserByUsername(@Param('username') username: string): Promise<ShowUserDTO> {
    return await this.usersService.findUserByUsername(username);
  }

}
