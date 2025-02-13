import { Injectable } from '@nestjs/common';
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
