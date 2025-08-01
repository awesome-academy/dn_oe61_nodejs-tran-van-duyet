// types/express-session.d.ts
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    success?: string;
    error?: string;
    message?: string;
    userId?: number;
    username?: string;
    isAdmin?: boolean;
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    session?: import('express-session').Session & Partial<import('express-session').SessionData>;
    cookies?: { [key: string]: string };
  }
}
