import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ArticleStatus } from '../common/enums/article-status.enum';
import { Article } from '../common/interfaces/entities';
import { InMemoryStoreService } from '../common/store/in-memory-store.service';
import { applyListQuery } from '../common/utils/list-query';
import { ArticleQueryDto } from './dto/article-query.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PaginatedResult } from '../common/interfaces/list-result.interface';

@Injectable()
export class ArticleService {
  constructor(private readonly store: InMemoryStoreService) {}

  findAll(query: ArticleQueryDto = {}): Article[] | PaginatedResult<Article> {
    const filtered = this.store.articles.filter((article) => {
      if (query.status && article.status !== query.status) {
        return false;
      }

      if (
        query.categoryId !== undefined &&
        article.categoryId !== query.categoryId
      ) {
        return false;
      }

      if (query.tag && !article.tags.includes(query.tag)) {
        return false;
      }

      return true;
    });

    return applyListQuery(filtered, query);
  }

  findOne(id: string): Article {
    const article = this.store.articles.find(
      (candidate) => candidate.id === id,
    );
    if (!article) {
      throw new NotFoundException(`Article with id "${id}" not found`);
    }
    return article;
  }

  create(dto: CreateArticleDto): Article {
    const timestamp = Date.now();
    const article: Article = {
      id: randomUUID(),
      title: dto.title,
      content: dto.content,
      status: dto.status ?? ArticleStatus.DRAFT,
      authorId: dto.authorId ?? null,
      categoryId: dto.categoryId ?? null,
      tags: dto.tags ?? [],
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.store.articles.push(article);
    return article;
  }

  update(id: string, dto: UpdateArticleDto): Article {
    const article = this.store.articles.find(
      (candidate) => candidate.id === id,
    );
    if (!article) {
      throw new NotFoundException(`Article with id "${id}" not found`);
    }

    article.title = dto.title;
    article.content = dto.content;
    article.status = dto.status ?? article.status;
    article.authorId =
      dto.authorId === undefined ? article.authorId : dto.authorId;
    article.categoryId =
      dto.categoryId === undefined ? article.categoryId : dto.categoryId;
    article.tags = dto.tags ?? article.tags;
    article.updatedAt = Date.now();
    return article;
  }

  delete(id: string): void {
    const index = this.store.articles.findIndex(
      (candidate) => candidate.id === id,
    );
    if (index === -1) {
      throw new NotFoundException(`Article with id "${id}" not found`);
    }

    this.store.articles.splice(index, 1);

    for (
      let commentIndex = this.store.comments.length - 1;
      commentIndex >= 0;
      commentIndex -= 1
    ) {
      if (this.store.comments[commentIndex].articleId === id) {
        this.store.comments.splice(commentIndex, 1);
      }
    }
  }
}
