import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service.js';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { RoleLibelle } from '../roles/enums/role-libelle.enum.js';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('bcrypt', () => ({
  compare: vi.fn(),
  hash: vi.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;

  const mockUser = {
    id: 'uuid-1',
    login: 'admin',
    mot_de_passe: '$2b$10$hashedpassword',
    nom_utilisateur: 'Administrateur',
    role: { libelle: 'ADMINISTRATEUR' },
  };

  const mockUserRepository = {
    findOne: vi.fn(),
  };

  const mockUsersService = {
    create: vi.fn(),
  };

  const mockJwtService = {
    signAsync: vi.fn().mockResolvedValue('mock.jwt.token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('devrait retourner un access_token si les identifiants sont valides', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

      const result = await service.login({
        login: 'admin',
        mot_de_passe: 'admin',
      });

      expect(result).toHaveProperty('access_token');
      expect(result.access_token).toBe('mock.jwt.token');
    });

    it('devrait lever NotFoundException si le login est inexistant', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.login({ login: 'inconnu', mot_de_passe: 'test' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('devrait lever UnauthorizedException si le mot de passe est incorrect', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      await expect(
        service.login({ login: 'admin', mot_de_passe: 'mauvais' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('devrait créer un utilisateur via UsersService et retourner un token et le user', async () => {
      mockUsersService.create.mockResolvedValue(mockUser);
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.register({
        nom_utilisateur: 'Nouveau',
        login: 'nouveau',
        mot_de_passe: 'password123',
        role: RoleLibelle.AGENT,
      });

      expect(mockUsersService.create).toHaveBeenCalledWith({
        nom_utilisateur: 'Nouveau',
        login: 'nouveau',
        mot_de_passe: 'password123',
        role: RoleLibelle.AGENT,
      });
      expect(result).toHaveProperty('access_token');
      expect(result.access_token).toBe('mock.jwt.token');
      expect(result.user).toEqual({
        id: mockUser.id,
        nom_utilisateur: mockUser.nom_utilisateur,
        login: mockUser.login,
        role: mockUser.role,
      });
    });
  });
});
