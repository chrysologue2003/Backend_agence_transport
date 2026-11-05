import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesDepensesService } from './categories-depenses.service.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategorieDepense } from './entities/categorie-depense.entity.js';
import { NotFoundException } from '@nestjs/common';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('CategoriesDepensesService', () => {
  let service: CategoriesDepensesService;

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
        CategoriesDepensesService,
        { provide: getRepositoryToken(CategorieDepense), useValue: mockRepo },
      ],
    }).compile();
    service = module.get<CategoriesDepensesService>(CategoriesDepensesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('retourne la liste des catégories', async () => {
      mockRepo.find.mockResolvedValue([{ id: '1', libelle: 'Carburant', famille: 'Exploitation' }]);
      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(result[0].libelle).toBe('Carburant');
    });
  });

  describe('findOne', () => {
    it('lève NotFoundException si la catégorie est introuvable', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('uuid-inexistant')).rejects.toThrow(NotFoundException);
    });

    it('retourne la catégorie trouvée', async () => {
      const cat = { id: '1', libelle: 'Carburant', famille: 'Exploitation' };
      mockRepo.findOne.mockResolvedValue(cat);
      expect(await service.findOne('1')).toEqual(cat);
    });
  });

  describe('create', () => {
    it('crée et retourne une catégorie', async () => {
      const dto = { libelle: 'Carburant', famille: 'Exploitation' };
      const created = { id: 'new-uuid', ...dto };
      mockRepo.create.mockReturnValue(created);
      mockRepo.save.mockResolvedValue(created);
      expect(await service.create(dto)).toEqual(created);
    });
  });
});
