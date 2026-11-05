import { Test, TestingModule } from '@nestjs/testing';
import { VehiculesService } from './vehicules.service.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Vehicule } from './entities/vehicule.entity.js';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { StatutVehicule } from './enums/statut-vehicule.enum.js';

describe('VehiculesService', () => {
  let service: VehiculesService;

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
        VehiculesService,
        { provide: getRepositoryToken(Vehicule), useValue: mockRepo },
      ],
    }).compile();
    service = module.get<VehiculesService>(VehiculesService);
  });

  it('should be defined', () => expect(service).toBeDefined());

  describe('create', () => {
    it('lève ConflictException si immatriculation déjà existante', async () => {
      mockRepo.findOne.mockResolvedValue({ immatriculation: 'ABC-1234' });
      await expect(service.create({
        immatriculation: 'ABC-1234', marque: 'Toyota', modele: 'Hilux', capacite: 5,
      })).rejects.toThrow(ConflictException);
    });

    it('crée un véhicule', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      const v = { immatriculation: 'ABC-1234', marque: 'Toyota', modele: 'Hilux', capacite: 5, statut: StatutVehicule.DISPONIBLE };
      mockRepo.create.mockReturnValue(v);
      mockRepo.save.mockResolvedValue(v);
      expect(await service.create({ immatriculation: 'ABC-1234', marque: 'Toyota', modele: 'Hilux', capacite: 5 })).toEqual(v);
    });
  });

  describe('findOne', () => {
    it('lève NotFoundException si véhicule introuvable', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('INEXISTANT')).rejects.toThrow(NotFoundException);
    });
  });
});
