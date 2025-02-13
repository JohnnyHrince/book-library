import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { BookService } from './book.service';
import { Prisma } from '@prisma/client';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  create(@Body() createBookDto: Prisma.BookCreateInput) {
    return this.bookService.create(createBookDto);
  }

  @Get()
  findAll() {
    return this.bookService.findAll();
  }

  @Get('category/:id')
  async getBooksByCategory(@Param('id') id: string) {
    return this.bookService.getBooksByCategory(Number(id));
  }

  @Get('categoryNested/:id')
  async getBooksByCategoryAndSubcategories(@Param('id') id: string) {
    return this.bookService.getBooksByCategoryAndSubcategories(Number(id));
  }

  @Get(':bookId')
  async getBook(@Param('bookId', ParseIntPipe) bookId: number) {
    return this.bookService.getBookWithCategoryPath(bookId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: Prisma.BookUpdateInput) {
    return this.bookService.update(+id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(+id);
  }
}
