import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';

export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request?.user;
    if (!user) {
      const i18n = I18nContext.current(ctx);
      const message = i18n?.t('auth.user_not_logged_in') || 'User not logged in';
      throw new UnauthorizedException(message);
    }
    return data ? user?.[data] : user;
  },
);
