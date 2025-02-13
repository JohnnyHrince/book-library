import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CategoryService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createCategory(createCategoryDto: Prisma.CategoryCreateInput) {
    return this.databaseService.category.create({
      data: createCategoryDto
    });
  }

  async getCategories() {
    return this.databaseService.category.findMany({
      where: {
        parentId: null,
      },
      include: {
        subcategories: {
          include: {
            subcategories: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  async update(id: number, updateCategoryDto: Prisma.CategoryUpdateInput) {
    return `This action updates a #${id} category`;
  }

  async remove(categoryId: number) {
    const subcategories = await this.databaseService.category.findMany({
      where: { 
        parentId: categoryId 
      },
      select: { 
        id: true 
      },
    });

    const subcategoryIds = subcategories.map(sub => sub.id);

    await this.databaseService.book.deleteMany({
      where: {
        categoryId: { in: [categoryId, ...subcategoryIds] },
      },
    });

    await this.databaseService.category.deleteMany({
      where: { id: { in: subcategoryIds } },
    });

    await this.databaseService.category.delete({
      where: { id: categoryId },
    });

    return { message: `Category and all related books deleted successfully` };
  }
}
