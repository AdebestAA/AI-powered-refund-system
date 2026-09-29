import type { UserRole } from "../common/lib/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: UserRole; email: string };
    }
  }
}

export {};
