import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../../data/entities/user.entity';
import { ShowUserDTO } from '../../models/users/show-user.dto';
import { UserRegisterDTO } from '../../models/users/user-register.dto';
import { UserLoginDTO } from '../../models/users/user-login.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async register(user: UserRegisterDTO): Promise<ShowUserDTO> {
    const newUser: User = this.usersRepository.create(user);

    const passwordHash = await bcrypt.hash(user.password, 10);
    newUser.password = passwordHash;

    const savedUser = await this.usersRepository.save(newUser);

    return this.convertToShowUserDTO(savedUser);
  }

  async findUserById(id: string): Promise<ShowUserDTO> {
    const foundUser = await this.usersRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!foundUser) {
      throw new BadRequestException('User with this ID does not exist.');
    }

    const convertedUser = await this.convertToShowUserDTO(foundUser);

    return convertedUser;
  }

  async findUserByEmail(email: string): Promise<ShowUserDTO> | undefined {
    const foundUser = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    if (!foundUser) {
      return undefined;
    }

    return this.convertToShowUserDTO(foundUser);
  }

  async findUserByUsername(username: string): Promise<ShowUserDTO> | undefined {
    const foundUser = await this.usersRepository.findOne({
      where: {
        username,
      },
    });

    if (!foundUser) {
      return undefined;
    }

    return this.convertToShowUserDTO(foundUser);
  }

  async validateUserPassword(user: UserLoginDTO): Promise<boolean> {
    const userEntity = await this.usersRepository.findOne({
      where: {
        email: user.email,
      },
    });

    return await bcrypt.compare(user.password, userEntity.password);
  }

  private async convertToShowUserDTO(user: User): Promise<ShowUserDTO> {

    const convertedUser: ShowUserDTO = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdOn: user.joined,
    };

    return convertedUser;
  }
}
