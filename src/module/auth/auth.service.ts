import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';

interface AuthenticatedUser {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: {
    name: string;
  };
}

interface LoginResponse {
  admin_token?: string;
  user_token?: string;
}
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.login(email);
    // with bcrypt "bcrypt.compare(pass, user.encrypted_password)"
    if (user && (await bcrypt.compare(pass, user.encrypted_password))) {
      const { encrypted_password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: AuthenticatedUser): Promise<LoginResponse> {
    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role.name,
    };
    return {
      admin_token: this.jwtService.sign(payload),
    };
  }

  async loginUser(user: AuthenticatedUser): Promise<LoginResponse> {
    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    };
    return {
      user_token: this.jwtService.sign(payload),
    };
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    const user = await this.usersService.findByEmail(googleUser.email);
    if (user) return user;
    return await this.usersService.create(googleUser);
  }
}
