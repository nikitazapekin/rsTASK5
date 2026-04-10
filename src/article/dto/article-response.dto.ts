import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArticleStatus } from '../../common/enums/article-status.enum';

export class ArticleResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ enum: ArticleStatus })
  status: ArticleStatus;

  @ApiPropertyOptional({ nullable: true })
  authorId: string | null;

  @ApiPropertyOptional({ nullable: true })
  categoryId: string | null;

  @ApiProperty({ type: [String] })
  tags: string[];

  @ApiProperty()
  createdAt: number;

  @ApiProperty()
  updatedAt: number;
}
