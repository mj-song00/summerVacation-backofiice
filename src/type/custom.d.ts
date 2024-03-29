import { Admin } from 'src/entity/admin.entity';

declare module 'express' {
  interface Request {
    user?: Admin;
  }
}
