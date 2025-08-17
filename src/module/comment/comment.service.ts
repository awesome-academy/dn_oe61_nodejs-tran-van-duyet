import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entities/Comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(
    post_id: number,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const { content, user_id } = createCommentDto;

    const comment = this.commentRepository.create({
      content,
      post: { id: post_id },
      user: { id: user_id },
    });

    return await this.commentRepository.save(comment);
  }

  // Get one comment
  async findByPostId(post_id: number): Promise<Comment[]> {
    const comments = await this.commentRepository.find({
      where: { post: { id: post_id } },
      relations: ['user'],
      select: {
        id: true,
        content: true,
        created_at: true,
        user: {
          id: true,
          name: true,
        },
      },
      order: { created_at: 'DESC' },
    });

    if (!comments || comments.length === 0) {
      throw new NotFoundException(`No comments found for post ${post_id}`);
    }

    return comments;
  }

  // Update comment
  async update(
    id: number,
    updateComment: UpdateCommentDto,
    i18n: I18nContext,
  ): Promise<Comment | null> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user'],
      select: {
        id: true,
        content: true,
        created_at: true,
        user: {
          id: true,
          name: true,
        },
      },
    });

    if (!comment) {
      throw new NotFoundException(i18n.t('comment.comment_not_found'));
    }
    
    if (updateComment.user_id !== comment.user.id) {
      throw new BadRequestException(i18n.t('comment.cannot_update'));
    }

    const result = await this.commentRepository.update(id, {
        content: updateComment.content,
    });

    if (result.affected === 0) {
      throw new NotFoundException(i18n.t('comment.update_error'));
    }

    return await this.commentRepository.findOne({ where: { id } });
  }

  // Delete comment
  async remove(
    id: number,
    user_id: number,
    i18n: I18nContext,
  ): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user'],
      select: {
        id: true,
        content: true,
        created_at: true,
        user: {
          id: true,
          name: true,
        },
      },
    });

    if (!comment) {
      throw new NotFoundException(i18n.t('comment.comment_not_found'));
    }

    if (16 !== comment.user.id) {
      throw new BadRequestException(i18n.t('comment.cannot_delete'));
    }
    await this.commentRepository.remove(comment);
    return comment;
  }
}
