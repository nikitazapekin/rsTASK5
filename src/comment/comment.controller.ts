import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { CommentQueryDto } from './dto/comment-query.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentService } from './comment.service';

@ApiTags('comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  @ApiOperation({ summary: 'Get comments for article' })
  @ApiOkResponse({ type: CommentResponseDto, isArray: true })
  @ApiBadRequestResponse()
  @ApiUnprocessableEntityResponse()
  findAll(@Query() query: CommentQueryDto) {
    return this.commentService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get comment by id' })
  @ApiOkResponse({ type: CommentResponseDto })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create comment' })
  @ApiCreatedResponse({ type: CommentResponseDto })
  @ApiBadRequestResponse()
  @ApiUnprocessableEntityResponse()
  create(@Body() dto: CreateCommentDto) {
    return this.commentService.create(dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete comment' })
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    this.commentService.delete(id);
  }
}
