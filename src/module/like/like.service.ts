import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nContext } from 'nestjs-i18n';
import { Like } from 'src/entities/Like.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,
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

  async like(post_id: number, user_id: number): Promise<Like> {
    const like = this.likesRepository.create({
      post: { id: post_id },
      user: { id: user_id },
    });
    return await this.likesRepository.save(like);
  }

  async unLike(
    post_id: number,
    user_id: number,
    i18n: I18nContext,
  ): Promise<Like> {
    const existingLike = await this.likesRepository.findOne({
      where: {
        post: { id: post_id },
        user: { id: user_id },
      },
    });
    if (!existingLike) {
      throw new NotFoundException(i18n.t('like.like_not_found'));
    }
    await this.likesRepository.delete(existingLike.id);
    return existingLike;
  }
}
