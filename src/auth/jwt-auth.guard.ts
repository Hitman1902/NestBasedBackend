import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = JwtPayload>(err: any, user: TUser): TUser {
    if (err || !user) {
      throw err || new Error('Unauthorized');
    }
    return user; // Return user as JwtPayload type
  }
}
