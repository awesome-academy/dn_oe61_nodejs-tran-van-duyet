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

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuardUser)
  @Post('posts/:id')
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
  async findByPostId(@ParseId('id') id: number) {
    const list_comment = await this.commentService.findByPostId(id);
    return { data: list_comment };
  }

  @UseGuards(JwtAuthGuardUser)
  @Patch(':id')
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

  @UseGuards(JwtAuthGuardUser)
  @Delete(':id')
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
