import { Test, TestingModule } from '@nestjs/testing';
import { AiSuggestionsController } from './ai-suggestions.controller';

describe('AiSuggestionsController', () => {
  let controller: AiSuggestionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiSuggestionsController],
    }).compile();

    controller = module.get<AiSuggestionsController>(AiSuggestionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
