import { Test, TestingModule } from '@nestjs/testing';
import { GoalUserService } from './goal-user.service';

describe('GoalUserService', () => {
  let service: GoalUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoalUserService],
    }).compile();

    service = module.get<GoalUserService>(GoalUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
