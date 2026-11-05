import { SetMetadata } from '@nestjs/common';
import { RoleLibelle } from '../../modules/roles/enums/role-libelle.enum.js';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleLibelle[]) =>
  SetMetadata(ROLES_KEY, roles);
