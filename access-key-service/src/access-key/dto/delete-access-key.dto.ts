import { IsString, IsUUID, IsUppercase } from 'class-validator';

export class DeleteAccessKeyDto {
  @IsString()
  @IsUppercase()
  key: string;

  @IsString()
  @IsUUID()
  userId: string;
}
