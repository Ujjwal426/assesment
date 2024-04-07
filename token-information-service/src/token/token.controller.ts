import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenDto } from './dto/get-token.dto';

@Controller('api/token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get()
  find(@Query() tokenDto: TokenDto) {
    return this.tokenService.find(tokenDto);
  }
}
