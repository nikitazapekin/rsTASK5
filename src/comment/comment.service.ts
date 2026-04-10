import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Comment } from '../common/interfaces/entities';
import { InMemoryStoreService } from '../common/store/in-memory-store.service';
import { applyListQuery } from '../common/utils/list-query';
import { CommentQueryDto } from './dto/comment-query.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PaginatedResult } from '../common/interfaces/list-result.interface';

@Injectable()
export class CommentService {
  constructor(private readonly store: InMemoryStoreService) {}

  findAll(query: CommentQueryDto): Comment[] | PaginatedResult<Comment> {
    const articleExists = this.store.articles.some(
      (article) => article.id === query.articleId,
    );
    if (!articleExists) {
      throw new UnprocessableEntityException(
        `Article with id "${query.articleId}" not found`,
      );
    }

    const filtered = this.store.comments.filter(
      (comment) => comment.articleId === query.articleId,
    );
    return applyListQuery(filtered, query);
  }

  findOne(id: string): Comment {
    const comment = this.store.comments.find(
      (candidate) => candidate.id === id,
    );
    if (!comment) {
      throw new NotFoundException(`Comment with id "${id}" not found`);
    }
    return comment;
  }

  create(dto: CreateCommentDto): Comment {
    const articleExists = this.store.articles.some(
      (article) => article.id === dto.articleId,
    );
    if (!articleExists) {
      throw new UnprocessableEntityException(
        `Article with id "${dto.articleId}" not found`,
      );
    }

    const comment: Comment = {
      id: randomUUID(),
      content: dto.content,
      articleId: dto.articleId,
      authorId: dto.authorId ?? null,
      createdAt: Date.now(),
    };

    this.store.comments.push(comment);
    return comment;
  }

  delete(id: string): void {
    const index = this.store.comments.findIndex(
      (candidate) => candidate.id === id,
    );
    if (index === -1) {
      throw new NotFoundException(`Comment with id "${id}" not found`);
    }

    this.store.comments.splice(index, 1);
  }
}
