import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: createUserDto,
    });
    return plainToClass(User, newUser);
  }

  async findAll(): Promise<User[]> {
    const allUsers = await this.prisma.user.findMany();
    return allUsers.map((user) => plainToClass(User, user));
  }

  async findOne(userId: string): Promise<User> {
    const userFound = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userFound) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return plainToClass(User, userFound);
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const userToUpdate = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userToUpdate) {
      throw new NotFoundException(`No user found for ID ${userId}`);
    }

    if (userToUpdate.password !== updateUserDto.oldPassword) {
      throw new ForbiddenException('Incorrect old password');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { version: { increment: 1 }, password: updateUserDto.newPassword },
    });

    return plainToClass(User, updatedUser);
  }

  async remove(userId: string): Promise<void> {
    try {
      await this.prisma.user.delete({ where: { id: userId } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Could not find user with ID ${userId}`);
      }
      throw error;
    }
  }
}
