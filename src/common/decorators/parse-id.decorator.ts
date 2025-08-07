import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';

export const ParseId = createParamDecorator(
  (paramName: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const value = request.params[paramName];
    const numericId = Number(value);

    if (isNaN(numericId)) {
      const i18n = I18nContext.current(ctx);
      const message = i18n?.t('common.invalid_id_format') || 'Invalid ID format';
      throw new BadRequestException(message);
    }

    return numericId;
  },
);
