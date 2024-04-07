import { BadRequestException, ConflictException, HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { hashSync } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<{ user: User; message: string }> {
    const { email, password, isAdmin } = createUserDto;
    try {
      // Check if user with the same email already exists
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });
      if (existingUser) {
        throw new HttpException('Email already exists', 400);
      }

      // Hash the password before storing it in the database
      const hashedPassword = hashSync(password, 10);

      const newUser = this.userRepository.create({
        email,
        password: hashedPassword,
        isAdmin: isAdmin ? true : false,
      });

      const userCreated = await this.userRepository.save(newUser);

      return { user: userCreated, message: 'User created successfully' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async findAll(): Promise<{ user: User[]; message: string }> {
    try {
      const users = await this.userRepository.find();
      return { user: users, message: 'List of all users' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string): Promise<{ user: User; message: string }> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      return { user: user, message: 'User Details' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
