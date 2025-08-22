import {
  Controller,
  Get,
  Post,
  Res,
  Body,
  Req,
  BadRequestException,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { jwtConstants } from '../auth/constants';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { I18n, I18nContext } from 'nestjs-i18n';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from '../user/users.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { GoogleAuthGuard } from './google-auth/google-auth.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { logoutAuthMessageResponseDto, activeAuthMessageResponseDto } from './dto/auth-message-response.dto';
import { ActivateDto } from './dto/activate.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  @ApiExcludeEndpoint()
  @Get('admin/login')
  loginView(
    @Req() req: Request,
    @Res() res: Response,
    @I18n() i18n: I18nContext,
  ) {
    const token = req.cookies['admin_token'];
    let message = req.session.message;
    let messageType = 'success';
    delete req.session.message;

    try {
      if (token) {
        const decoded = this.jwtService.verify(token, {
          secret: jwtConstants.secret,
        });
        return res.redirect('/');
      }
    } catch (error) {
      console.error('JWT verify error:', error.message);
    }
    // else if (!message) {
    //     message = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
    //     messageType = 'warning';
    // }

    return res.render('admin/login', {
      layout: 'login',
      t: i18n.t('auth'),
      message,
      messageType,
    });
  }

  @ApiExcludeEndpoint()
  @Post('login')
  async login(
    @Body() body,
    @Res() res: Response,
    @Req() req: Request,
    @I18n() i18n: I18nContext,
  ) {
    const { email, password } = body;
    const t = i18n.t('auth') as any;
    const user = await this.authService.validateUser(email, password);

    if (user !== null && user.role_id === 1) {
      const jwt = await this.authService.login(user);
      res.cookie('admin_token', jwt.admin_token, {
        httpOnly: true, // Do not allow JS access (anti-XSS)
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: 'lax', // GReducing CSRF Risk
        // secure: true,             // Enable if you use HTTPS
      });
      req.session.message = t.messageLogin;
      return res.status(200).json({});
    } else {
      return res.status(401).json({
        message: t.wrongPassword,
      });
    }
  }

  @Post('user/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng nhập cho người dùng (User)' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công.', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Sai email hoặc mật khẩu / Tài khoản chưa kích hoạt.' })
  async loginUser(
    @Body() body,
    @Res() res: Response,
    @Req() req: Request,
    @I18n() i18n: I18nContext,
  ) {
    const { email, password } = body;
    const t = i18n.t('auth') as any;
    const user = await this.authService.validateUser(email, password);

    if (user === null) {
      return res.status(401).json({ status: 0, message: t.wrongPassword });
    } else if (user.status === 1) {
      const jwt = await this.authService.loginUser(user);
      
      res.cookie('user_token', jwt.user_token, {
        httpOnly: true, // Do not allow JS access (anti-XSS)
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: 'lax', // GReducing CSRF Risk
        // secure: true,             // Enable if you use HTTPS
      });
      return res.status(200).json({ message: t.messageLogin, token_user: jwt });
    } else {
      return res.status(401).json({ message: t.check_activate });
    }
  }

  @ApiExcludeEndpoint()
  @Get('logout')
  logout(@Res() res: Response, @Req() req: Request, @I18n() i18n: I18nContext) {
    res.clearCookie('admin_token');
    const t = i18n.t('auth') as any;
    req.session.message = t.messageLogout;
    return res.redirect('/auth/admin/login');
  }

  @Get('logout/user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng xuất cho người dùng (User)' })
  @ApiResponse({ status: 200, description: 'Đăng xuất thành công.', type: logoutAuthMessageResponseDto })
  logoutUser(@Res() res: Response, @I18n() i18n: I18nContext) {
    res.clearCookie('user_token');
    const t = i18n.t('auth') as any;
    return res.status(200).json({ message: t.messageLogout });
  }

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  @ApiResponse({ status: 201, description: 'Đăng ký thành công.', type: RegisterResponseDto })
  @ApiResponse({ status: 400, description: 'Mật khẩu không khớp hoặc email đã tồn tại.' })
  async register(
    @Body() CreateUserDto: CreateUserDto,
    @I18n() i18n: I18nContext,
  ) {
    const t = i18n.t('auth') as any;
    if (CreateUserDto.encrypted_password !== CreateUserDto.repassword) {
      return {
        message: t.confirm_password,
      };
    }
    const existingUser = await this.usersService.findByEmail(
      CreateUserDto.email,
    );
    if (existingUser) {
      return {
        status: false,
        message: t.Check_email,
      };
    }
    await this.usersService.register(CreateUserDto);
    return {
      status: true,
      message: t.REGISTER_SUCCESS,
    };
  }

  @Post('activate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Kích hoạt tài khoản' })
  @ApiBody({ type: ActivateDto })
  @ApiResponse({ status: 200, description: 'Kích hoạt thành công.', type: activeAuthMessageResponseDto })
  @ApiResponse({ status: 400, description: 'Token không hợp lệ.' })
  async activate(@Body() body, @I18n() i18n: I18nContext) {
    const t = i18n.t('auth') as any;
    await this.usersService.activateAccount(body.token);
    return {
      status: true,
      message: t.activated,
    };
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Bắt đầu quá trình đăng nhập với Google' })
  @ApiResponse({ status: 302, description: 'Redirect đến trang đăng nhập của Google.' })
  googleLogin() {}

  @ApiExcludeEndpoint()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req, @Res() res: Response, @I18n() i18n: I18nContext) {
    const jwt = await this.authService.loginUser(req.user);
    res.cookie('user_token', jwt.user_token, {
      httpOnly: true, // Do not allow JS access (anti-XSS)
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: 'lax', // GReducing CSRF Risk
      // secure: true,             // Enable if you use HTTPS
    });
    return res.status(200).json({ 
      status: true,
      message: i18n.t('auth.messageLogin'),
      token_user: jwt 
    });
  }
}
