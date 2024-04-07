import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const { metatype } = metadata;
    console.log('metadata', metadata);
    if (!metatype || !this.toValidate(metatype as any)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const message = errors
        .map((error) => Object.values(error.constraints))
        .join(', ');
      throw new HttpException(message, 400);
    }
    return value;
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
