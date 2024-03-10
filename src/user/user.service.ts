import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { plainToClass } from 'class-transformer';
import { DatabaseService } from '../database/database.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createUserDto: CreateUserDto): User {
    const newUser: User = this.createUserObject(createUserDto);
    this.databaseService.users.add(newUser.id, newUser);
    return plainToClass(User, newUser);
  }

  private createUserObject(createUserDto: CreateUserDto): User {
    const now = Date.now();
    const newUser: User = {
      ...createUserDto,
      version: 1,
      createdAt: now,
      updatedAt: now,
      id: uuidv4(),
    };
    return newUser;
  }

  findAll(): User[] {
    return this.databaseService.users.fetchAll();
  }

  findOne(id: string): User {
    const user = this.databaseService.users.find(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} could not be located.`);
    }
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto): User {
    this.validateOldPassword(id, updateUserDto.oldPassword);
    const updatedUser: User = this.getUpdatedUser(
      id,
      updateUserDto.newPassword,
    );
    this.databaseService.users.add(id, updatedUser);
    return plainToClass(User, updatedUser);
  }

  private validateOldPassword(id: string, oldPassword: string): void {
    const user = this.findOne(id);
    if (user.password !== oldPassword) {
      throw new ForbiddenException('Previous password is wrong');
    }
  }

  private getUpdatedUser(id: string, newPassword: string): User {
    const user = this.findOne(id);
    return {
      ...user,
      password: newPassword,
      updatedAt: Date.now(),
      version: user.version + 1,
    };
  }

  remove(id: string): void {
    this.ensureUserExists(id);
    this.databaseService.users.delete(id);
  }

  private ensureUserExists(id: string): void {
    if (!this.databaseService.users.exists(id)) {
      throw new NotFoundException(`User ${id} not found`);
    }
  }
}
