import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ParseId } from 'src/common/decorators/parse-id.decorator';
import { JwtAuthGuardUser } from '../auth/jwt-auth.guard-user';
import { User } from 'src/common/decorators/user.decorator';
import { I18n, I18nContext } from 'nestjs-i18n';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCommentResponseDto, DeleteCommentResponseDto, UpdateCommentResponseDto } from './dto/comment-response.dto';
import { CommentListResponseDto } from './dto/comment-list-response.dto';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuardUser)
  @Post('posts/:id')
  @ApiOperation({ summary: 'Tạo một bình luận mới cho bài viết' })
  @ApiParam({ name: 'id', description: 'ID của bài viết cần bình luận' })
  @ApiResponse({ status: 201, description: 'Bình luận bài viết thành công', type: CreateCommentResponseDto })
  @ApiResponse({ status: 401, description: 'Chưa xác thực.' })
  async create(
    @ParseId('id') id: number,
    @Body() createCommentDto: CreateCommentDto,
    @User() user,
    @I18n() i18n: I18nContext,
  ) {
    createCommentDto.user_id = user.sub;

    const comment = await this.commentService.create(id, createCommentDto);
    return {
      status: true,
      message: i18n.t('comment.create_success'),
      data: comment,
    };
  }

  @Get('posts/:id')
  @ApiOperation({ summary: 'Lấy danh sách bình luận của một bài viết' })
  @ApiParam({ name: 'id', description: 'ID của bài viết' })
  @ApiResponse({ status: 200, description: 'Thành công.', type: CommentListResponseDto })
  @ApiResponse({ status: 404, description: 'Bình luận không tồn tại' })
  async findByPostId(@ParseId('id') id: number) {
    const list_comment = await this.commentService.findByPostId(id);
    return { data: list_comment };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuardUser)
  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật một bình luận' })
  @ApiParam({ name: 'id', description: 'ID của bình luận cần cập nhật' })
  @ApiResponse({ status: 200, description: 'Sửa bình luận thành công', type: DeleteCommentResponseDto })
  @ApiResponse({ status: 400, description: 'Bạn không thể sửa bình luận này' })
  @ApiResponse({ status: 404, description: 'Bình luận không tồn tại' })
  async update(
    @ParseId('id') id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @User() user,
    @I18n() i18n: I18nContext,
  ) {
    updateCommentDto.user_id = user.sub;

    const comment = await this.commentService.update(
      id,
      updateCommentDto,
      i18n,
    );
    return {
      status: true,
      message: i18n.t('comment.update_success'),
      data: comment,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuardUser)
  @Delete(':id')
  @ApiOperation({ summary: 'Xóa một bình luận' })
  @ApiParam({ name: 'id', description: 'ID của bình luận cần xóa' })
  @ApiResponse({ status: 200, description: 'Xoá bình luận thành công', type: UpdateCommentResponseDto })
  @ApiResponse({ status: 400, description: 'Bạn không thể xoá bình luận này' })
  @ApiResponse({ status: 404, description: 'Bình luận không tồn tại' })
  async remove(
    @ParseId('id') id: number,
    @I18n() i18n: I18nContext,
    @User() user,
  ) {
    const comment = await this.commentService.remove(id, +user.sub, i18n);
    return {
      status: true,
      message: i18n.t('comment.delete_success'),
      data: comment,
    };
  }
}
