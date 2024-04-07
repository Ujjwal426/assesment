import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<{
        user: import("./entities/user.entity").User;
        message: string;
    }>;
    findAll(): Promise<{
        user: import("./entities/user.entity").User[];
        message: string;
    }>;
    findOne(id: string): Promise<{
        user: import("./entities/user.entity").User;
        message: string;
    }>;
}
