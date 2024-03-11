import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToClass } from 'class-transformer';
import { DatabaseService } from '../database/database.service';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createUserDto: CreateUserDto): User {
    const newUser = this.createUserObject(createUserDto);
    this.databaseService.users.add(newUser.id, newUser);
    return plainToClass(User, newUser);
  }

  private createUserObject(createUserDto: CreateUserDto): User {
    const now = Date.now();
    return {
      ...createUserDto,
      id: uuidv4(),
      version: 1,
      createdAt: now,
      updatedAt: now,
    };
  }

  findAll(): User[] {
    return this.databaseService.users
      .fetchAll()
      .map((user) => plainToClass(User, user));
  }

  findOne(id: string): User {
    this.ensureUserExists(id);
    const user = this.databaseService.users.getOne(id);
    return plainToClass(User, user);
  }

  update(id: string, updateUserDto: UpdateUserDto): User {
    this.ensureUserExists(id);

    const user = this.databaseService.users.getOne(id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    if (user.password !== updateUserDto.oldPassword) {
      throw new ForbiddenException('Previous password is incorrect.');
    }

    const updatedUser = {
      ...user,
      ...updateUserDto,
      password: updateUserDto.newPassword,
      updatedAt: Date.now(),
      version: user.version + 1,
    };

    this.databaseService.users.add(id, updatedUser);
    return plainToClass(User, updatedUser);
  }

  private ensureUserExists(id: string): void {
    if (!this.databaseService.users.exists(id)) {
      throw new NotFoundException(`User with ID ${id} could not be located.`);
    }
  }

  remove(id: string): void {
    this.ensureUserExists(id);
    this.databaseService.users.delete(id);
  }
}
