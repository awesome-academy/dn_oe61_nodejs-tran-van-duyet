import { Request, Response, NextFunction } from 'express';

export function LanguageMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.query.lang) {
    res.cookie('lang', req.query.lang.toString(), {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
  }
  next();
}
