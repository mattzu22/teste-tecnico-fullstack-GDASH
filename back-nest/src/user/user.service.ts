import { LoggerService } from 'src/common/services/logger.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, HydratedDocument } from 'mongoose';
import { UserRepository } from './user.repository';
import { BcryptService } from 'src/auth/hashing/bcrypt.service';
import { ObjectId } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userService: Model<User>,
    private readonly logger: LoggerService,
    private readonly userRepository: UserRepository,
    private readonly bcryptService: BcryptService,
  ) {}

  async create(
    body: CreateUserDto,
  ): Promise<{ message: string; userId: string }> {
    try {
      const { email, name, password } = body;

      if (!email || !name || !password) {
        throw new NotFoundException(
          'Missing required fields: email, name, or password',
        );
      }

      const emailExisting = await this.findByEmail(email);

      if (emailExisting) {
        throw new ConflictException('Email already registered.');
      }

      const passwordHash = await this.bcryptService.hashPassword(password);

      const newUser = {
        email,
        name,
        passwordHash,
      };

      const createdUser: HydratedDocument<User> =
        await this.userService.create(newUser);

      this.logger.log(`Created user: ${createdUser._id.toString()}`);

      return { message: 'User created', userId: createdUser._id.toString() };
    } catch (error) {
      const err = error as Error;

      this.logger.error(`Failed to create user: ${err.message}`, {
        stack: err.stack,
      });

      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to create user.',
        err.message,
      );
    }
  }
  async list(): Promise<{ id: ObjectId; name: string; email: string }[]> {
    try {
      const users = await this.userService.find().exec();

      if (users.length === 0) {
        throw new NotFoundException('No users found.');
      }

      const dateUsers = users.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
      }));

      this.logger.log(`found ${users.length} users.`);

      return dateUsers;
    } catch (error) {
      const err = error as Error;

      this.logger.error(`Failed to list users: ${err.message}`, {
        stack: err.stack,
      });

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to list users.');
    }
  }
  async update(body: UpdateUserDto, id: string): Promise<{ message: string }> {
    try {
      const user = await this.findById(id);

      const { password, newPassword, ...otherFields } = body;
      const updateData: Partial<UpdateUserDto & { passwordHash?: string }> = {
        ...otherFields,
      };

      if (newPassword) {
        if (!password) {
          throw new ConflictException(
            'To set a new password, the current password must be provided.',
          );
        }

        const comparePassword = await this.bcryptService.comparePassword(
          password,
          user.passwordHash,
        );

        if (!comparePassword) {
          throw new ConflictException('Current password is incorrect.');
        }

        updateData.passwordHash =
          await this.bcryptService.hashPassword(newPassword);
      }

      if (Object.keys(updateData).length === 0) {
        return { message: 'No fields to update.' };
      }

      await this.userService.updateOne({ _id: id }, updateData).exec();

      this.logger.log(`Updated user: ${id}`);

      return { message: 'User updated.' };
    } catch (error) {
      const err = error as Error;

      this.logger.error(`Failed to update user: ${err.message}`, {
        stack: err.stack,
      });

      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to update user.',
        err.message,
      );
    }
  }
  async delete(id: string): Promise<{ message: string }> {
    try {
      await this.findById(id);

      await this.userService.deleteOne({ _id: id }).exec();

      this.logger.log(`Deleted user: ${id}`);

      return { message: 'User deleted.' };
    } catch (error) {
      const err = error as Error;

      this.logger.error(`Failed to delete user: ${err.message}`, {
        stack: err.stack,
      });

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to delete user.',
        err.message,
      );
    }
  }

  async findById(id: string): Promise<HydratedDocument<User>> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  async findByEmail(email: string): Promise<HydratedDocument<User> | null> {
    const user = await this.userRepository.findByEmail(email);

    return user;
  }
}
