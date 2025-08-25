import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DeepMocked, createMock } from '@golevelup/ts-jest';

describe('CategoryController (Auto-mocking with useMocker)', () => {
  let controller: CategoryController;
  let service: DeepMocked<CategoryService>;

  // --- MOCK DATA & CONSTANTS ---
  const mockCategory = {
    id: 1,
    name: 'Salary',
    type: 1,
    description: 'Monthly salary',
    created_by: 1,
    updated_by: null,
    created_at: new Date(),
    updated_at: new Date(),
    createdByUser: null,
    updatedByUser: null,
    categoryUsers: [],
  };

  const mockCreateDto: CreateCategoryDto = {
    name: 'Groceries',
    type: 0,
    description: 'For food',
    created_by: 1,
  };

  const mockUpdateDto: UpdateCategoryDto = {
    name: 'Updated Groceries',
    description: 'Updated description',
  };

  const mockI18nContext = {
    t: (key: string) => {
      if (key === 'category') {
        return {
          create_success: 'Category created successfully',
          create_error: 'Failed to create category',
          update_success: 'Category updated successfully',
          update_error: 'Failed to update category',
          delete_success: 'Category deleted successfully',
        };
      }
      if (key === 'layout') {
        return { title: 'Layout' };
      }
      return {};
    },
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
    })
    .useMocker(createMock)
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: jest.fn(() => true) })
    .compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get(CategoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- CREATE ---
  describe('create', () => {
    it('should create a new category successfully', async () => {
      service.create.mockResolvedValue(mockCategory as any);
      await expect(controller.create(mockCreateDto, mockI18nContext)).resolves.toEqual({
        message: 'Category created successfully',
      });
      expect(service.create).toHaveBeenCalledWith(mockCreateDto);
    });

    it('should throw BadRequestException with correct message if service returns a falsy value', async () => {
      service.create.mockResolvedValue(false as any);
      const expectedError = new BadRequestException('Failed to create category');
      await expect(controller.create(mockCreateDto, mockI18nContext)).rejects.toThrow(expectedError);
    });

    it('should throw TypeError if i18n context is invalid', async () => {
      await expect(controller.create(mockCreateDto, null as any)).rejects.toThrow(TypeError);
    });
  });

  // --- GET PAGINATED ---
  describe('getUsersJson', () => {
    it('should calculate totalPages correctly for multiple pages', async () => {
      const totalItems = 12;
      const limit = 5;
      const expectedTotalPages = 3;
      service.findAll.mockResolvedValue([[], totalItems]);
      const result = await controller.getUsersJson(1, limit, mockI18nContext);
      expect(result.totalPages).toBe(expectedTotalPages);
    });

    it('should handle pagination values of 0 by defaulting them to 1', async () => {
      service.findAll.mockResolvedValue([[], 0]);
      await controller.getUsersJson(0, 0, mockI18nContext);
      expect(service.findAll).toHaveBeenCalledWith(1, 1);
    });
  });

  // --- FIND ONE ---
  describe('findOne', () => {
    it('should get a single category', async () => {
      service.findOne.mockResolvedValue(mockCategory as any);
      await expect(controller.findOne('1')).resolves.toEqual(mockCategory);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should propagate NotFoundException from service', async () => {
      const expectedError = new NotFoundException('Category not found');
      service.findOne.mockRejectedValue(expectedError);
      await expect(controller.findOne('999')).rejects.toThrow(expectedError);
    });

    it('should call service with NaN for a non-numeric id', async () => {
      service.findOne.mockResolvedValue(null as any);
      await controller.findOne('abc');
      expect(service.findOne).toHaveBeenCalledWith(NaN);
    });
  });

  // --- UPDATE ---
  describe('update', () => {
    it('should update a category successfully', async () => {
      const updatedCategory = { ...mockCategory, ...mockUpdateDto };
      service.update.mockResolvedValue(updatedCategory as any);
      const result = await controller.update('1', mockUpdateDto, mockI18nContext);
      expect(result.category).toEqual(updatedCategory);
    });

    it('should throw BadRequestException if update fails', async () => {
      service.update.mockResolvedValue(null);
      const expectedError = new BadRequestException('Failed to update category');
      await expect(controller.update('1', mockUpdateDto, mockI18nContext)).rejects.toThrow(expectedError);
    });

    it('should call service with NaN for a non-numeric id', async () => {
      service.update.mockResolvedValue(null);
      await expect(controller.update('abc', mockUpdateDto, mockI18nContext)).rejects.toThrow(BadRequestException);
      expect(service.update).toHaveBeenCalledWith(NaN, mockUpdateDto);
    });
  });

  // --- REMOVE ---
  describe('remove', () => {
    it('should delete a category successfully', async () => {
      service.remove.mockResolvedValue(mockCategory as any);
      await expect(controller.remove('1', mockI18nContext)).resolves.toEqual({
        message: 'Category deleted successfully',
      });
    });

    it('should propagate NotFoundException from service when removing', async () => {
      const expectedError = new NotFoundException('Category to delete not found');
      service.remove.mockRejectedValue(expectedError);
      await expect(controller.remove('999', mockI18nContext)).rejects.toThrow(expectedError);
    });

    it('should call service with NaN for a non-numeric id', async () => {
      service.remove.mockResolvedValue(null as any);
      await controller.remove('abc', mockI18nContext);
      expect(service.remove).toHaveBeenCalledWith(NaN);
    });

    it('should propagate unexpected errors from service', async () => {
      const unexpectedError = new Error('Database connection lost');
      service.remove.mockRejectedValue(unexpectedError);
      await expect(controller.remove('1', mockI18nContext)).rejects.toThrow(unexpectedError);
    });
  });
});
