import { Test, TestingModule } from '@nestjs/testing';
import { LogsService } from './logs.service';
import { PrismaService } from '../prisma.service';

describe('LogsService', () => {
  let service: LogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogsService, PrismaService],
    }).compile();

    service = module.get<LogsService>(LogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a log', async () => {
    const data = {
      UserID: 1,
      LogText: 'Test Log',
    };

    const result = await service.createLog(data);

    expect(result.UserID).toEqual(data.UserID);
    expect(result.LogText).toEqual(data.LogText);
  });
});
