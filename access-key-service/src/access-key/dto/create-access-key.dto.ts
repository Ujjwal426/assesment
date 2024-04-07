import { IsNumberString, IsString, IsUUID, Length } from 'class-validator';

export class CreateAccessKeyDto {
  @IsString()
  @IsNumberString()
  @Length(1, 5)
  requestsPerMinute: string;

  @IsString()
  @IsUUID()
  userId: string;

  @IsString()
  @IsNumberString()
  expirationTime: string;

  @IsString()
  @IsUUID()
  adminId: string;
}
