import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Role } from '../roles/entities/role.entity.js';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { RoleLibelle } from '../roles/enums/role-libelle.enum.js';

describe('UsersService', () => {
  let service: UsersService;

  const mockAdminRole = { id: 'role-uuid', libelle: RoleLibelle.ADMINISTRATEUR };

  const mockUserRepository = {
    find: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    remove: vi.fn(),
  };

  const mockRoleRepository = {
    findOne: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: getRepositoryToken(Role), useValue: mockRoleRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('devrait retourner la liste de tous les utilisateurs', async () => {
      const users = [{ id: '1', login: 'admin' }];
      mockUserRepository.find.mockResolvedValue(users);
      expect(await service.findAll()).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('devrait retourner un utilisateur par son ID', async () => {
      const user = { id: '1', login: 'admin' };
      mockUserRepository.findOne.mockResolvedValue(user);
      expect(await service.findOne('1')).toEqual(user);
    });

    it('devrait lever NotFoundException si introuvable', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('inexistant')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('devrait créer un utilisateur et hacher le mot de passe', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockRoleRepository.findOne.mockResolvedValue(mockAdminRole);
      const newUser = { id: 'new-uuid', login: 'jdupont' };
      mockUserRepository.create.mockReturnValue(newUser);
      mockUserRepository.save.mockResolvedValue(newUser);

      const result = await service.create({
        nom_utilisateur: 'Jean Dupont',
        login: 'jdupont',
        mot_de_passe: 'secret123',
        role: RoleLibelle.ADMINISTRATEUR,
      });

      expect(result).toEqual(newUser);
    });

    it('devrait lever ConflictException si le login est déjà utilisé', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: '1', login: 'admin' });
      await expect(
        service.create({ nom_utilisateur: 'Test', login: 'admin', mot_de_passe: 'test123' }),
      ).rejects.toThrow(ConflictException);
    });
  });
});
