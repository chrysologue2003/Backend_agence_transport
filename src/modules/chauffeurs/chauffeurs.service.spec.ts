import { Test, TestingModule } from '@nestjs/testing';
import { ChauffeursService } from './chauffeurs.service.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Chauffeur } from './entities/chauffeur.entity.js';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { StatutChauffeur } from './enums/statut-chauffeur.enum.js';

describe('ChauffeursService', () => {
  let service: ChauffeursService;

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
        ChauffeursService,
        { provide: getRepositoryToken(Chauffeur), useValue: mockRepo },
      ],
    }).compile();
    service = module.get<ChauffeursService>(ChauffeursService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('lève ConflictException si le matricule existe déjà', async () => {
      mockRepo.findOne.mockResolvedValue({ matricule: 'CH-001' });
      await expect(
        service.create({
          matricule: 'CH-001',
          nom: 'Rasoa',
          telephone: '+261320000000',
          numero_permis: 'P-123456',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('crée un chauffeur', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      const c = {
        matricule: 'CH-001',
        nom: 'Rasoa',
        telephone: '+261320000000',
        numero_permis: 'P-123456',
        statut: StatutChauffeur.DISPONIBLE,
      };
      mockRepo.create.mockReturnValue(c);
      mockRepo.save.mockResolvedValue(c);
      expect(
        await service.create({
          matricule: 'CH-001',
          nom: 'Rasoa',
          telephone: '+261320000000',
          numero_permis: 'P-123456',
        }),
      ).toEqual(c);
    });
  });

  describe('findOne', () => {
    it('lève NotFoundException si le chauffeur est introuvable', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('INEXISTANT')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
