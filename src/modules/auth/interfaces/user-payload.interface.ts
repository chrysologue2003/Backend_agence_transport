import { RoleLibelle } from '../../roles/enums/role-libelle.enum.js';

export interface UserPayload {
  sub: string;
  login: string;
  role: RoleLibelle;
}
