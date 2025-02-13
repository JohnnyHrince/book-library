import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { DatabaseService } from '../database/database.service';

describe('BookService', () => {
  let bookService: BookService;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: DatabaseService,
          useValue: {
            book: {
              findUnique: jest.fn(),
            },
            category: {
              findUnique: jest.fn(),
          },
        }
      },
    ],
  }).compile();

    bookService = module.get<BookService>(BookService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should return a book with category path', async () => {
    (databaseService.book.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      title: 'Dune',
      categoryId: 2,
    });

    (databaseService.category.findUnique as jest.Mock).mockImplementation(({ where }) => {
      const categoryMap = {
        2: { id: 2, name: 'Sci-Fi', parentId: 1 },
        1: { id: 1, name: 'Fiction', parentId: null },
      };
      return Promise.resolve(categoryMap[where.id]);
    });

    const book = await bookService.getBookWithCategoryPath(1);
    expect(book.categoryPath).toBe('Fiction > Sci-Fi');
  });
});