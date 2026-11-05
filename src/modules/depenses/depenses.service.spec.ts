import { Test, TestingModule } from '@nestjs/testing';
import { DepensesService } from './depenses.service.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Depense } from './entities/depense.entity.js';
import { CategorieDepense } from '../categories-depenses/entities/categorie-depense.entity.js';
import { Vehicule } from '../vehicules/entities/vehicule.entity.js';
import { DataSource } from 'typeorm';
import { ModePaiement } from '../../common/enums/mode-paiement.enum.js';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('DepensesService', () => {
  let service: DepensesService;

  const mockDepenseRepo = {
    findAndCount: vi.fn(),
    findOne: vi.fn(),
  };
  const mockCategorieRepo = { findOne: vi.fn() };
  const mockVehiculeRepo = { findOne: vi.fn() };

  // Mock DataSource transaction method
  const mockManager = {
    findOne: vi.fn(),
    create: vi.fn((entity, val) => val),
    save: vi.fn((entity, val) => Promise.resolve({ id: 'depense-uuid-new', ...val })),
  };

  const mockDataSource = {
    transaction: vi.fn((cb) => cb(mockManager)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepensesService,
        { provide: getRepositoryToken(Depense), useValue: mockDepenseRepo },
        { provide: getRepositoryToken(CategorieDepense), useValue: mockCategorieRepo },
        { provide: getRepositoryToken(Vehicule), useValue: mockVehiculeRepo },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<DepensesService>(DepensesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('devrait enregistrer une dépense et un mouvement de caisse SORTIE', async () => {
      mockManager.findOne.mockImplementation((entity, opts) => {
        if (entity === CategorieDepense) return Promise.resolve({ id: 'cat-1', libelle: 'Carburant' });
        return Promise.resolve(null); // latest movement is null (balance = 0)
      });

      const result = await service.create(
        {
          date_depense: '2026-08-28',
          categorie_id: 'cat-1',
          description: 'Achat de carburant',
          montant: 500,
          mode_paiement: ModePaiement.ESPECES,
        },
        { sub: 'user-1' },
      );

      expect(result).toBeDefined();
      expect(result.montant).toBe(500);
      expect(mockDataSource.transaction).toHaveBeenCalled();
    });
  });
});
