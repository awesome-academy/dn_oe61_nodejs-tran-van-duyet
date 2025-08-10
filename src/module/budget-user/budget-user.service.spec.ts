import { Test, TestingModule } from '@nestjs/testing';
import { BudgetUserService } from './budget-user.service';

describe('BudgetUserService', () => {
  let service: BudgetUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BudgetUserService],
    }).compile();

    service = module.get<BudgetUserService>(BudgetUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
