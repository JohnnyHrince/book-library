import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { DatabaseService } from '../database/database.service';

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: DatabaseService,
          useValue: {
            category: {
              findMany: jest.fn(),
              deleteMany: jest.fn(),
              delete: jest.fn(),
            },
            book: {
              deleteMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    categoryService = module.get<CategoryService>(CategoryService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should fetch books from a category and its subcategories', async () => {
    (databaseService.category.findMany as jest.Mock).mockResolvedValue([
      { id: 2, parentId: 1 },
      { id: 3, parentId: 2 },
    ]);

    (databaseService.book.findMany as jest.Mock).mockResolvedValue([
      { id: 1, title: '1984', categoryId: 1 },
      { id: 2, title: 'Dune', categoryId: 2 },
    ]);
  });

  it('should delete a category and its books', async () => {
    (databaseService.category.findMany as jest.Mock).mockResolvedValue([{ id: 2, parentId: 1 }]);
    (databaseService.book.deleteMany as jest.Mock).mockResolvedValue({ count: 2 });

    const result = await categoryService.remove(1);
    expect(result).toEqual({ message: 'Category and all related books deleted successfully' });
  });
});
