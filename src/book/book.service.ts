import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class BookService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createBookDto: Prisma.BookCreateInput) {
    return this.databaseService.book.create({
      data: createBookDto,
    })
  }

  async getBookWithCategoryPath(bookId: number) {
    const book = await this.databaseService.book.findUnique({
      where: { 
        id: bookId 
      },
      include: { 
        category: true 
      },
    });
  
    if (!book) {
      throw new NotFoundException(`Book with ID ${bookId} not found`);
    }
  
    // Function to recursively build the category path
    async function getCategoryPath(categoryId: number): Promise<string[]> {
      const category = await this.databaseService.category.findUnique({
        where: { id: categoryId },
        include: { parent: true }, // Get parent category if exists
      });
  
      if (!category) return [];
  
      // Recursively get parent categories
      const parentPath = category.parentId ? await getCategoryPath(category.parentId) : [];
      return [...parentPath, category.name]; // Append current category
    }
  
    const categoryPath = book.categoryId ? await getCategoryPath(book.categoryId) : [];
  
    return {
      id: book.id,
      title: book.title,
      author: book.author,
      categoryPath: categoryPath.join(" > "), // Use " > " as breadcrumb separator
    };
  }
  
  async getBooksByCategory(categoryId: number) {
    return this.databaseService.book.findMany({
      where: {
        categoryId: categoryId,
      },
      include: {
        category: true,
      },
    });
  }

  async getBooksByCategoryAndSubcategories(categoryId: number) {
    // Fetch all categories including subcategories recursively
    const categories = await this.getAllNestedCategories(categoryId);

    // Extract all category IDs
    const categoryIds = categories.map(category => category.id);

    // Fetch all books in those categories
    return this.databaseService.book.findMany({
      where: {
        categoryId: {
          in: categoryIds,
        },
      },
      include: {
        category: true,
      },
    });
  }

  private async getAllNestedCategories(categoryId: number, categories: any[] = []): Promise<any[]> {
    const category = await this.databaseService.category.findUnique({
      where: { id: categoryId },
      include: {
        subcategories: true,
      },
    });

    if (category) {
      categories.push(category);

      for (const subcategory of category.subcategories) {
        await this.getAllNestedCategories(subcategory.id, categories);
      }
    }

    return categories;
  }

  async findAll() {
    return this.databaseService.book.findMany();
  }

  async findOne(id: number) {
    return this.databaseService.book.findUnique({
      where: {
        id,
      }
    })
  }

  async update(id: number, updateBookDto: Prisma.BookUpdateInput) {
    return this.databaseService.book.update({
      where: {
        id,
      },
      data: updateBookDto,
    })
  }

  async remove(id: number) {
    return this.databaseService.book.delete({
      where: {
        id,
      }
    })
  }
}
