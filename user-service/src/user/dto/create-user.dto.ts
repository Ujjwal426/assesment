import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Length(8, 15)
  @IsNotEmpty()
  password: string;

  isAdmin: boolean;
}
