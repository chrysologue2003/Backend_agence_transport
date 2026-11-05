import { Test, TestingModule } from '@nestjs/testing';
import { TypesPrestationsService } from './types-prestations.service.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypePrestation } from './entities/type-prestation.entity.js';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('TypesPrestationsService', () => {
  let service: TypesPrestationsService;

  const mockRepo = {
    find: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypesPrestationsService,
        { provide: getRepositoryToken(TypePrestation), useValue: mockRepo },
      ],
    }).compile();
    service = module.get<TypesPrestationsService>(TypesPrestationsService);
  });

  it('should be defined', () => expect(service).toBeDefined());

  describe('findAll', () => {
    it('retourne la liste des types', async () => {
      mockRepo.find.mockResolvedValue([{ code: 'LOC', libelle: 'Location' }]);
      const result = await service.findAll();
      expect(result).toHaveLength(1);
    });
  });

  describe('create', () => {
    it('crée un type de prestation', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      const tp = { code: 'LOC', libelle: 'Location' };
      mockRepo.create.mockReturnValue(tp);
      mockRepo.save.mockResolvedValue(tp);
      expect(await service.create({ code: 'LOC', libelle: 'Location' })).toEqual(tp);
    });

    it('lève ConflictException si code déjà existant', async () => {
      mockRepo.findOne.mockResolvedValue({ code: 'LOC' });
      await expect(service.create({ code: 'LOC', libelle: 'X' })).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('lève NotFoundException si introuvable', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('XYZ')).rejects.toThrow(NotFoundException);
    });
  });
});
