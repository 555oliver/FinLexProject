import { Role } from '../users/role.enum';

export interface AuthUser {
  id: string;
  names: string;
  email: string;
  username: string;
  role: Role;
}
