import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  createUser(@Body() body: CreateUserDto): User {
    return this.userService.create(body);
  }

  @Get()
  getAllUsers(): User[] {
    return this.userService.findAll();
  }

  @Get(':id')
  getUserById(@Param('id', ParseUUIDPipe) uuid: string): User {
    return this.userService.findOne(uuid);
  }

  @Put(':id')
  updateUser(
    @Param('id', ParseUUIDPipe) uuid: string,
    @Body() body: UpdateUserDto,
  ): User {
    return this.userService.update(uuid, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param('id', ParseUUIDPipe) uuid: string): void {
    this.userService.remove(uuid);
  }
}
