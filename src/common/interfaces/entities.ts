import { ArticleStatus } from '../enums/article-status.enum';
import { UserRole } from '../enums/user-role.enum';

export interface User {
  id: string;
  login: string;
  password: string;
  role: UserRole;
  createdAt: number;
  updatedAt: number;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  status: ArticleStatus;
  authorId: string | null;
  categoryId: string | null;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Comment {
  id: string;
  content: string;
  articleId: string;
  authorId: string | null;
  createdAt: number;
}

export type PublicUser = Omit<User, 'password'>;
