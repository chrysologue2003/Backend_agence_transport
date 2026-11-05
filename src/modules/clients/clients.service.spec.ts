import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Client } from './entities/client.entity.js';
import { NotFoundException } from '@nestjs/common';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('ClientsService', () => {
  let service: ClientsService;

  const mockRepo = {
    findAndCount: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        { provide: getRepositoryToken(Client), useValue: mockRepo },
      ],
    }).compile();
    service = module.get<ClientsService>(ClientsService);
  });

  it('should be defined', () => expect(service).toBeDefined());

  describe('findAll', () => {
    it('retourne la liste paginée des clients', async () => {
      mockRepo.findAndCount.mockResolvedValue([[{ id: '1', nom: 'Rakoto' }], 1]);
      const result = await service.findAll(1, 20);
      expect(result.total).toBe(1);
      expect(result.data).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('lève NotFoundException si client introuvable', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('uuid-inexistant')).rejects.toThrow(NotFoundException);
    });

    it('retourne le client trouvé', async () => {
      const client = { id: '1', nom: 'Rakoto', telephone: '+261340000000' };
      mockRepo.findOne.mockResolvedValue(client);
      expect(await service.findOne('1')).toEqual(client);
    });
  });

  describe('create', () => {
    it('crée et retourne un client', async () => {
      const dto = { nom: 'Rakoto', telephone: '+261340000000' };
      const created = { id: 'new-uuid', ...dto };
      mockRepo.create.mockReturnValue(created);
      mockRepo.save.mockResolvedValue(created);
      expect(await service.create(dto)).toEqual(created);
    });
  });
});
