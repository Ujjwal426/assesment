import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, IsUppercase } from 'class-validator';

export class TokenDto {
  @IsString()
  @IsUppercase()
  @IsNotEmpty()
  key: string;
}
