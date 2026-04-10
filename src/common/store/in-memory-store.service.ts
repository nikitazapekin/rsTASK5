import { Injectable } from '@nestjs/common';
import { Article, Category, Comment, User } from '../interfaces/entities';

@Injectable()
export class InMemoryStoreService {
  readonly users: User[] = [];
  readonly articles: Article[] = [];
  readonly categories: Category[] = [];
  readonly comments: Comment[] = [];
}
