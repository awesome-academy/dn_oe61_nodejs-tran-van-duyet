import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { I18nService } from 'nestjs-i18n';

interface AuthRequest {
  cookies?: Record<string, string>;
  headers: Record<string, string | undefined>;
}
@Injectable()
export class JwtAuthGuardUser implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuardUser.name);
  constructor(
    private jwtService: JwtService,
    private readonly i18n: I18nService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    const token =
      request.cookies?.user_token || // If you store JWT in cookie
      request.headers['authorization']?.replace('Bearer ', '');

    if (!token) {
      this.logger.warn('Missing authentication token');
      throw new UnauthorizedException(this.i18n.t('auth.token_not_found'));
    }

    try {
      const decoded = await this.jwtService.verifyAsync(token);
      request['user'] = decoded;
      return true;
    } catch (error) {
      this.logger.error('Token verification failed', error.stack);
      throw new UnauthorizedException(this.i18n.t('auth.token_invalid_or_expired'));
    }
  }
}
