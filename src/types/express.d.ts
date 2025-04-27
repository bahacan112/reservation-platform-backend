// src/types/express.d.ts

declare namespace Express {
  export interface Request {
    user?: any;
    headers: Record<string, string | string[] | undefined>;
  }
}
