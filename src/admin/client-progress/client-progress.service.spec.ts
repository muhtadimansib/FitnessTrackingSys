import { Test, TestingModule } from '@nestjs/testing';
import { ClientProgressService } from './client-progress.service';

describe('ClientProgressService', () => {
  let service: ClientProgressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientProgressService],
    }).compile();

    service = module.get<ClientProgressService>(ClientProgressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
