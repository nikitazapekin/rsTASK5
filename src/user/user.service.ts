import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { InMemoryStoreService } from '../common/store/in-memory-store.service';
import { PublicUser, User } from '../common/interfaces/entities';
import { UserRole } from '../common/enums/user-role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { applyListQuery } from '../common/utils/list-query';
import { PaginatedResult } from '../common/interfaces/list-result.interface';
import { ListQueryDto } from '../common/dto/list-query.dto';

const toPublicUser = (user: User): PublicUser => ({
  id: user.id,
  login: user.login,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

@Injectable()
export class UserService {
  constructor(private readonly store: InMemoryStoreService) {}

  findAll(
    query: ListQueryDto = {},
  ): PublicUser[] | PaginatedResult<PublicUser> {
    return applyListQuery(this.store.users.map(toPublicUser), query);
  }

  findOne(id: string): PublicUser {
    const user = this.store.users.find((candidate) => candidate.id === id);
    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    return toPublicUser(user);
  }

  create(dto: CreateUserDto): PublicUser {
    const timestamp = Date.now();
    const user: User = {
      id: randomUUID(),
      login: dto.login,
      password: dto.password,
      role: dto.role ?? UserRole.VIEWER,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.store.users.push(user);
    return toPublicUser(user);
  }

  update(id: string, body: UpdateUserDto): PublicUser {
    const hasRole = body.role !== undefined;
    const hasPasswordFields =
      body.oldPassword !== undefined || body.newPassword !== undefined;

    if (!hasRole && !hasPasswordFields) {
      throw new BadRequestException('Invalid update payload');
    }

    const user = this.store.users.find((candidate) => candidate.id === id);
    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }

    if (hasRole && !hasPasswordFields) {
      user.role = body.role;
      user.updatedAt = Date.now();
      return toPublicUser(user);
    }

    if (body.oldPassword === undefined || body.newPassword === undefined) {
      throw new BadRequestException('Invalid update payload');
    }

    if (user.password !== body.oldPassword) {
      throw new ForbiddenException('Old password is wrong');
    }

    user.password = body.newPassword;
    user.updatedAt = Date.now();
    return toPublicUser(user);
  }

  delete(id: string): void {
    const index = this.store.users.findIndex(
      (candidate) => candidate.id === id,
    );
    if (index === -1) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }

    this.store.users.splice(index, 1);

    for (const article of this.store.articles) {
      if (article.authorId === id) {
        article.authorId = null;
        article.updatedAt = Date.now();
      }
    }

    for (
      let commentIndex = this.store.comments.length - 1;
      commentIndex >= 0;
      commentIndex -= 1
    ) {
      if (this.store.comments[commentIndex].authorId === id) {
        this.store.comments.splice(commentIndex, 1);
      }
    }
  }
}
