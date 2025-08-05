import { Controller, Get, Post, Res, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { jwtConstants } from '../auth/constants';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Get('admin/login')
  loginView(@Req() req: Request, @Res() res: Response, @I18n() i18n: I18nContext) {
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

  @Post('login')
  async login(@Body() body, @Res() res: Response, @Req() req: Request, @I18n() i18n: I18nContext) {
    const { email, password } = body;
    const t = i18n.t('auth') as any;
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      return res.status(401).json({ message: t.wrongPassword });
    }

    const jwt = await this.authService.login(user);
    res.cookie('admin_token', jwt.admin_token, {
      httpOnly: true, // Do not allow JS access (anti-XSS)
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: 'lax', // GReducing CSRF Risk
      // secure: true,             // Enable if you use HTTPS
    });
    req.session.message = t.messageLogin;
    return res.status(200).json({});
  }

  @Get('logout')
  logout(@Res() res: Response, @Req() req: Request, @I18n() i18n: I18nContext) {
    res.clearCookie('admin_token');
    const t = i18n.t('auth') as any;
    req.session.message = t.messageLogout;
    return res.redirect('/auth/admin/login');
  }
}
