import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Category } from '../common/interfaces/entities';
import { InMemoryStoreService } from '../common/store/in-memory-store.service';
import { applyListQuery } from '../common/utils/list-query';
import { PaginatedResult } from '../common/interfaces/list-result.interface';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ListQueryDto } from '../common/dto/list-query.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly store: InMemoryStoreService) {}

  findAll(query: ListQueryDto = {}): Category[] | PaginatedResult<Category> {
    return applyListQuery(this.store.categories, query);
  }

  findOne(id: string): Category {
    const category = this.store.categories.find(
      (candidate) => candidate.id === id,
    );
    if (!category) {
      throw new NotFoundException(`Category with id "${id}" not found`);
    }
    return category;
  }

  create(dto: CreateCategoryDto): Category {
    const category: Category = {
      id: randomUUID(),
      name: dto.name,
      description: dto.description,
    };

    this.store.categories.push(category);
    return category;
  }

  update(id: string, dto: UpdateCategoryDto): Category {
    const category = this.store.categories.find(
      (candidate) => candidate.id === id,
    );
    if (!category) {
      throw new NotFoundException(`Category with id "${id}" not found`);
    }

    category.name = dto.name;
    category.description = dto.description;
    return category;
  }

  delete(id: string): void {
    const index = this.store.categories.findIndex(
      (candidate) => candidate.id === id,
    );
    if (index === -1) {
      throw new NotFoundException(`Category with id "${id}" not found`);
    }

    this.store.categories.splice(index, 1);

    for (const article of this.store.articles) {
      if (article.categoryId === id) {
        article.categoryId = null;
        article.updatedAt = Date.now();
      }
    }
  }
}
