import { Test, TestingModule } from '@nestjs/testing';
import { PaiementsService } from './paiements.service.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Paiement } from './entities/paiement.entity.js';
import { Activite } from '../activites/entities/activite.entity.js';
import { DataSource } from 'typeorm';
import { ModePaiement } from '../../common/enums/mode-paiement.enum.js';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('PaiementsService', () => {
  let service: PaiementsService;

  const mockPaiementRepo = {
    findAndCount: vi.fn(),
    findOne: vi.fn(),
    createQueryBuilder: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      getRawOne: vi.fn().mockResolvedValue({ sum: '500' }),
    })),
  };
  const mockActiviteRepo = { findOne: vi.fn() };

  const mockManager = {
    findOne: vi.fn(),
    create: vi.fn((entity, val) => val),
    save: vi.fn((entity, val) =>
      Promise.resolve({ id: 'paiement-uuid-new', ...val }),
    ),
    createQueryBuilder: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      getRawOne: vi.fn().mockResolvedValue({ sum: '500' }),
    })),
  };

  const mockDataSource = {
    transaction: vi.fn((cb) => cb(mockManager)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaiementsService,
        { provide: getRepositoryToken(Paiement), useValue: mockPaiementRepo },
        { provide: getRepositoryToken(Activite), useValue: mockActiviteRepo },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<PaiementsService>(PaiementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('devrait enregistrer un paiement en base de données', async () => {
      const mockAct = {
        id: 'act-1',
        prix: 1000,
        statut: 'EN_ATTENTE',
        reste_a_payer: 1000,
        type_prestation: { libelle: 'Location' },
      };

      mockManager.findOne.mockImplementation((entity, opts) => {
        if (entity === Activite) return Promise.resolve(mockAct);
        return Promise.resolve(null);
      });

      const result = await service.create(
        {
          activite_id: 'act-1',
          date_paiement: '2026-08-28',
          montant: 200,
          mode_paiement: ModePaiement.MOBILE_MONEY,
          reference: 'REF-1',
        },
        { sub: 'user-1' },
      );

      expect(result).toBeDefined();
      expect(result.montant).toBe(200);
      expect(mockDataSource.transaction).toHaveBeenCalled();
    });
  });
});
