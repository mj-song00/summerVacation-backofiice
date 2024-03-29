import { Admin } from 'src/admin/entities/admin.entity';

declare module 'express' {
  interface Request {
    user?: Admin;
  }
}
