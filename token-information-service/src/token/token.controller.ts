import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenDto } from './dto/get-token.dto';

@Controller('api/token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get()
  @UsePipes(new ValidationPipe())
  find(@Query() tokenDto: TokenDto) {
    console.log('tokenDto', tokenDto);
    return this.tokenService.find(tokenDto);
  }
}
