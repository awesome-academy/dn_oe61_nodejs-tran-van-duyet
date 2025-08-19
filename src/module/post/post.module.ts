import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entities/Post.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { JwtAuthGuardUser } from '../auth/jwt-auth.guard-user';
import { LikeModule } from '../like/like.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30d' },
    }),
    LikeModule
  ],
  controllers: [PostController],
  providers: [PostService, JwtAuthGuardUser],
})
export class PostModule {}
