import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CommentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  articleId: string;

  @ApiPropertyOptional({ nullable: true })
  authorId: string | null;

  @ApiProperty()
  createdAt: number;
}
