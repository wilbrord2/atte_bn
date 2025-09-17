import { Test, TestingModule } from '@nestjs/testing';
import { ClassManagementController } from './classroom.v1.controller';

describe('ClassManagementControllerV1', () => {
  let controller: ClassManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassManagementController],
    }).compile();

    controller = module.get<ClassManagementController>(
      ClassManagementController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
