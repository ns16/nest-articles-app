import { Admin } from '../../entities/admin.entity';

export interface LoginResponse {
  model: Admin;
  token: string;
}
