import { Test, TestingModule } from '@nestjs/testing';
import { ActivitesService } from './activites.service.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Activite } from './entities/activite.entity.js';
import { Client } from '../clients/entities/client.entity.js';
import { Vehicule } from '../vehicules/entities/vehicule.entity.js';
import { Chauffeur } from '../chauffeurs/entities/chauffeur.entity.js';
import { TypePrestation } from '../types-prestations/entities/type-prestation.entity.js';
import { PaiementsService } from '../paiements/paiements.service.js';
import { StatutVehicule } from '../vehicules/enums/statut-vehicule.enum.js';
import { StatutChauffeur } from '../chauffeurs/enums/statut-chauffeur.enum.js';
import { StatutActivite } from './enums/statut-activite.enum.js';
import { NotFoundException } from '@nestjs/common';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('ActivitesService', () => {
  let service: ActivitesService;

  const mockActiviteRepo = {
    findAndCount: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    remove: vi.fn(),
  };
  const mockClientRepo = { findOne: vi.fn() };
  const mockVehiculeRepo = { findOne: vi.fn(), save: vi.fn() };
  const mockChauffeurRepo = { findOne: vi.fn(), save: vi.fn() };
  const mockTypePrestationRepo = { findOne: vi.fn() };
  const mockPaiementsService = {
    create: vi.fn(),
    getPaymentsTotalForActivity: vi.fn().mockResolvedValue(0),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivitesService,
        { provide: getRepositoryToken(Activite), useValue: mockActiviteRepo },
        { provide: getRepositoryToken(Client), useValue: mockClientRepo },
        { provide: getRepositoryToken(Vehicule), useValue: mockVehiculeRepo },
        { provide: getRepositoryToken(Chauffeur), useValue: mockChauffeurRepo },
        { provide: getRepositoryToken(TypePrestation), useValue: mockTypePrestationRepo },
        { provide: PaiementsService, useValue: mockPaiementsService },
      ],
    }).compile();

    service = module.get<ActivitesService>(ActivitesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('devrait créer une activité avec succès', async () => {
      mockClientRepo.findOne.mockResolvedValue({ id: 'client-1' });
      mockTypePrestationRepo.findOne.mockResolvedValue({ code: 'LOC' });
      mockVehiculeRepo.findOne.mockResolvedValue({
        immatriculation: 'ABC-1234',
        statut: StatutVehicule.DISPONIBLE,
      });
      mockChauffeurRepo.findOne.mockResolvedValue({
        matricule: 'CH-001',
        statut: StatutChauffeur.DISPONIBLE,
      });

      const actData = {
        id: 'act-1',
        client_id: 'client-1',
        prix: 1000,
        avance: 0,
        reste_a_payer: 1000,
        statut: StatutActivite.EN_ATTENTE,
      };
      mockActiviteRepo.create.mockReturnValue(actData);
      mockActiviteRepo.save.mockResolvedValue(actData);
      mockActiviteRepo.findOne.mockResolvedValue(actData);

      const result = await service.create(
        {
          client_id: 'client-1',
          immatriculation: 'ABC-1234',
          matricule_chauffeur: 'CH-001',
          type_prestation_code: 'LOC',
          date_activite: '2026-08-28',
          prix: 1000,
          avance: 0,
        },
        { sub: 'user-1' },
      );

      expect(result).toBeDefined();
      expect(result.prix).toBe(1000);
    });

    it('devrait lever NotFoundException si client introuvable', async () => {
      mockClientRepo.findOne.mockResolvedValue(null);
      await expect(
        service.create(
          {
            client_id: 'client-invalide',
            type_prestation_code: 'LOC',
            date_activite: '2026-08-28',
            prix: 1000,
          },
          { sub: 'user-1' },
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
