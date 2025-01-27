import {
  Injectable,
  Inject,
  UnauthorizedException,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthValidate } from './validate-token';
@Injectable()
export class CheckAdmin implements CanActivate {
  constructor(
    @Inject('role') private readonly roles: string[],
    private authValidate: AuthValidate,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];
    const decode = this.authValidate.validateToken(token);
    const role = decode.role;
    if (role !== 'Admin') {
      throw new UnauthorizedException('Access denied');
    }
    return true;
  }
}
