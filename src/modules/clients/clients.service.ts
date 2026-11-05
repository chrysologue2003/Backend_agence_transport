import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { Client } from './entities/client.entity.js';
import { CreateClientDto } from './dto/create-client.dto.js';
import { UpdateClientDto } from './dto/update-client.dto.js';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async findAll(page = 1, limit = 20, sort = 'date_creation', search?: string): Promise<{ data: Client[]; total: number }> {
    const options: FindManyOptions<Client> = {
      skip: (page - 1) * limit,
      take: limit,
      order: { [sort]: 'DESC' } as any,
    };
    if (search) {
      options.where = [
        { nom: ILike(`%${search}%`) },
        { telephone: ILike(`%${search}%`) },
      ];
    }
    const [data, total] = await this.clientRepository.findAndCount(options);
    return { data, total };
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) throw new NotFoundException(`Client #${id} introuvable`);
    return client;
  }

  async create(dto: CreateClientDto): Promise<Client> {
    return this.clientRepository.save(this.clientRepository.create(dto));
  }

  async update(id: string, dto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);
    Object.assign(client, dto);
    return this.clientRepository.save(client);
  }

  async remove(id: string): Promise<void> {
    const client = await this.findOne(id);
    await this.clientRepository.remove(client);
  }
}
