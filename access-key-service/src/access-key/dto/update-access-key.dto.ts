import { PartialType } from '@nestjs/mapped-types';
import { CreateAccessKeyDto } from './create-access-key.dto';
import { IsBoolean, IsNotEmpty, IsNumberString, IsString, IsUUID, IsUppercase, Length } from 'class-validator';

export class UpdateAccessKeyDto extends PartialType(CreateAccessKeyDto) {
  @IsString()
  @IsNumberString()
  @Length(1, 5)
  requestsPerMinute?: string;

  @IsString()
  @IsNumberString()
  expirationTime?: string;

  @IsBoolean()
  isActive?: boolean;
}

export class UpdateAccessKeyQueryDto extends PartialType(CreateAccessKeyDto) {
  @IsNotEmpty()
  @IsString()
  @IsUppercase()
  key: string;

  @IsString()
  @IsUUID()
  userId?: string;
}
