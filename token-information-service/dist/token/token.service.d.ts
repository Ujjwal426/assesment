import { TokenDto } from './dto/get-token.dto';
import { Repository } from 'typeorm';
import { KeyLog } from './entities/token.entity';
export declare class TokenService {
    private readonly keyLogRepository;
    private readonly logger;
    constructor(keyLogRepository: Repository<KeyLog>);
    find(tokenDto: TokenDto): Promise<{
        message: string;
    }>;
}
