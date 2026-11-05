import { Test, TestingModule } from '@nestjs/testing';
import { RecettesService } from './recettes.service.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Recette } from './entities/recette.entity.js';
import { NotFoundException } from '@nestjs/common';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('RecettesService', () => {
  let service: RecettesService;

  const mockRepo = {
    findAndCount: vi.fn(),
    findOne: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecettesService,
        { provide: getRepositoryToken(Recette), useValue: mockRepo },
      ],
    }).compile();
    service = module.get<RecettesService>(RecettesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('retourne la liste paginée des recettes', async () => {
      mockRepo.findAndCount.mockResolvedValue([[{ id: '1', montant: 500 }], 1]);
      const result = await service.findAll(1, 20);
      expect(result.total).toBe(1);
      expect(result.data).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('lève NotFoundException si la recette est introuvable', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('uuid-inexistant')).rejects.toThrow(NotFoundException);
    });

    it('retourne la recette trouvée', async () => {
      const recette = { id: '1', montant: 500 };
      mockRepo.findOne.mockResolvedValue(recette);
      expect(await service.findOne('1')).toEqual(recette);
    });
  });
});
