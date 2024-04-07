import { Injectable, CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class JwtFormatValidationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new HttpException('No token provided', 401);
    }

    try {
      jwtDecode(token);
      return true; // Token format is valid
    } catch (err) {
      throw new HttpException(err.message, 401);
    }
  }
}
