import { TokenService } from './token.service';
import { TokenDto } from './dto/get-token.dto';
export declare class TokenController {
    private readonly tokenService;
    constructor(tokenService: TokenService);
    find(tokenDto: TokenDto): Promise<{
        message: string;
    }>;
}
