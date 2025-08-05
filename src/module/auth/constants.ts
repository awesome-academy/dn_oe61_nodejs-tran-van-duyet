import { ConfigService } from '@nestjs/config';

export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '1d',
};
