import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nContext } from 'nestjs-i18n';
import { Like } from 'src/entities/Like.entity';
import { Post } from 'src/entities/Post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  async hasUserLikedPost(postId: number, userId: number): Promise<boolean> {
    const existingLike = await this.likesRepository.findOne({
      where: {
        post: { id: postId },
        user: { id: userId },
      },
    });
    return existingLike !== null;
  }

  async like(post_id: number, user_id: number, i18n: I18nContext): Promise<Like | null> {
    const post = await this.postsRepository.findOne({ where: {id: post_id}});
    if (!post) {
      throw new NotFoundException(i18n.t('post.not_found'));
    }
    const like = this.likesRepository.create({
      post: { id: post_id },
      user: { id: user_id },
    });
    await this.likesRepository.save(like);
    return this.likesRepository.findOne({
      where: { id: like.id },
      relations: ['post', 'user'],
      select: {
        id: true,
        created_at: true,
        updated_at: true,
        user: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
        post: {
          id: true,
        },
      },
    });
  }

  async unLike(
    post_id: number,
    user_id: number,
    i18n: I18nContext,
  ): Promise<Like> {
    const post = await this.postsRepository.findOne({ where: {id: post_id}});
    if (!post) {
      throw new NotFoundException(i18n.t('post.not_found'));
    }
    const existingLike = await this.likesRepository.findOne({
      where: {
        post: { id: post_id },
        user: { id: user_id },
      },
      relations: ['post', 'user'],
      select: {
        id: true,
        created_at: true,
        updated_at: true,
        user: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
        post: {
          id: true,
        },
      },
    });
    if (!existingLike) {
      throw new NotFoundException(i18n.t('like.like_not_found'));
    }
    await this.likesRepository.delete(existingLike.id);
    return existingLike;
  }
}
