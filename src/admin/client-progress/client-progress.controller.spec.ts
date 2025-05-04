import { Test, TestingModule } from '@nestjs/testing';
import { ClientProgressController } from './client-progress.controller';

describe('ClientProgressController', () => {
  let controller: ClientProgressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientProgressController],
    }).compile();

    controller = module.get<ClientProgressController>(ClientProgressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
