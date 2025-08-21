import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from 'src/entities/Like.entity';
import { User } from 'src/entities/User.entity';
import { Post } from 'src/entities/Post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Like, Post])],
  providers: [LikeService],
  exports: [LikeService]
})
export class LikeModule {}
