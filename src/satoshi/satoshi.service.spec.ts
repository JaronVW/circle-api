import { Test, TestingModule } from '@nestjs/testing';
import { SatoshiService } from './satoshi.service';

describe('SatoshiService', () => {
  let service: SatoshiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SatoshiService],
    }).compile();

    service = module.get<SatoshiService>(SatoshiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
