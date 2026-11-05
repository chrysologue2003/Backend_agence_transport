import { Test, TestingModule } from '@nestjs/testing';
import { CaisseService } from './caisse.service.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MouvementCaisse } from './entities/mouvement-caisse.entity.js';
import { Recette } from '../recettes/entities/recette.entity.js';
import { Depense } from '../depenses/entities/depense.entity.js';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('CaisseService', () => {
  let service: CaisseService;

  const mockMouvementRepo = {
    findAndCount: vi.fn(),
  };
  const mockRecetteRepo = {
    createQueryBuilder: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      getRawOne: vi.fn().mockResolvedValue({ sum: '1000' }),
    })),
  };
  const mockDepenseRepo = {
    createQueryBuilder: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      getRawOne: vi.fn().mockResolvedValue({ sum: '400' }),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CaisseService,
        { provide: getRepositoryToken(MouvementCaisse), useValue: mockMouvementRepo },
        { provide: getRepositoryToken(Recette), useValue: mockRecetteRepo },
        { provide: getRepositoryToken(Depense), useValue: mockDepenseRepo },
      ],
    }).compile();
    service = module.get<CaisseService>(CaisseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findMouvements', () => {
    it('retourne la liste paginée des mouvements de caisse', async () => {
      mockMouvementRepo.findAndCount.mockResolvedValue([[{ id: '1', type_mouvement: 'ENTREE', montant: 1000 }], 1]);
      const result = await service.findMouvements(1, 20);
      expect(result.total).toBe(1);
      expect(result.data).toHaveLength(1);
    });
  });

  describe('calculateSolde', () => {
    it('calcule le solde recettes - dépenses sur une période donnée', async () => {
      const result = await service.calculateSolde('2026-08-01', '2026-08-28');
      expect(result.recettes_total).toBe(1000);
      expect(result.depenses_total).toBe(400);
      expect(result.solde).toBe(600);
    });
  });
});
