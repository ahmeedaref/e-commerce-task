import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthValidate {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}
  validateToken(Token: string) {
    try {
      const secretKey = this.configService.get<string>('ACCESSTOKEN');
      if (!secretKey) {
        throw new UnauthorizedException(
          'No secret key found for token verification',
        );
      }
      const accesstoken = this.jwtService.verify(Token, { secret: secretKey });
      return accesstoken;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
