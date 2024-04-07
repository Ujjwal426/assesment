import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<{
        user: User;
        message: string;
    }>;
    findAll(): Promise<{
        user: User[];
        message: string;
    }>;
    findOne(id: string): Promise<{
        user: User;
        message: string;
    }>;
}
