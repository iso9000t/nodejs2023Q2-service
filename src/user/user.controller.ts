import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  addUser(@Body() createUserDto: CreateUserDto): User {
    return this.userService.addUser(createUserDto); // Renamed dto to createUserDto
  }

  @Get()
  getAllUsers(): User[] {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id', ParseUUIDPipe) id: string): User {
    return this.userService.getUserById(id);
  }

  @Put(':id')
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): User {
    return this.userService.updateUser(id, updateUserDto); // Renamed dto to updateUserDto
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param('id', ParseUUIDPipe) id: string): void {
    this.userService.deleteUser(id);
  }
}
