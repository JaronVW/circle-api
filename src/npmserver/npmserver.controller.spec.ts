import { Test, TestingModule } from '@nestjs/testing';
import { NpmserverController } from './npmserver.controller';
import { NpmserverService } from './npmserver.service';

describe('NpmserverController', () => {
  let controller: NpmserverController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NpmserverController],
      providers: [NpmserverService],
    }).compile();

    controller = module.get<NpmserverController>(NpmserverController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
