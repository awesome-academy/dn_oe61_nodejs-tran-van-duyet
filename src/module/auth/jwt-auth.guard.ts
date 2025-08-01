import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const token =
      request.cookies?.admin_token || // If you store JWT in cookie
      request.headers['authorization']?.replace('Bearer ', '');

    if (!token) {
      return this.redirectToLogin(response);
    }

    try {
      const decoded = await this.jwtService.verifyAsync(token);
      request['user'] = decoded;
      return true;
    } catch (error) {
      return this.redirectToLogin(response);
    }
  }
  private redirectToLogin(response: Response): boolean {
    response.redirect('/auth/admin/login');
    return false;
  }
}
