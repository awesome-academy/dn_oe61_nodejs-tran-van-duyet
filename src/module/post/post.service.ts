import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from 'src/entities/Post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
      @InjectRepository(Post) 
      private readonly postsRepository: Repository<Post> 
  ) {}

  async create(createPostDto: CreatePostDto) {
    const post = await this.postsRepository.create(createPostDto);
    return this.postsRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .select([
        'post.id',
        'post.title',
        'post.content',
        'post.created_at',
        'post.updated_at',
        'user.id',
        'user.name',
        'user.email',
        'user.avatar'
      ])
      .getMany();
  }

  async findOne(id: number): Promise<Post | null> {
    return await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .select([
        'post.id',
        'post.title',
        'post.content',
        'post.created_at',
        'post.updated_at',
        'user.id',
        'user.name',
        'user.email',
        'user.avatar'
      ])
      .where('post.id = :id', { id })
      .getOne();
  }

  async update(id: number, user_id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postsRepository.findOne({ where: { id }, relations: ['user'] });
    
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    const check_id_user = post.user.id;
    if (user_id !== check_id_user) {
      return false;
    }
    console.log(updatePostDto);
    
    await this.postsRepository.update(id, updatePostDto);
    return this.postsRepository.findOne({ where: { id } });
  }

  async remove(id: number, user_id: number) {
    const post = await this.postsRepository.findOne({ where: { id }, relations: ['user'] });
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    const check_id_user = post.user.id;
    if (user_id !== check_id_user) {
      return false;
    }
    await this.postsRepository.delete(id);
    return post;
  }

}
