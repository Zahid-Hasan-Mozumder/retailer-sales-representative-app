import { Role } from '../enums';

export interface User {
  id: string;
  username: string;
  name: string;
  phone: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
