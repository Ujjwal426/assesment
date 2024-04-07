import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsUppercase } from 'class-validator';

export class TokenDto {
  @IsString()
  @IsUppercase()
  key: string;
}
