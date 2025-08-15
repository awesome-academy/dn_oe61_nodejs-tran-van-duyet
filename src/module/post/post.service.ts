import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from 'src/entities/Post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { I18n, I18nContext } from 'nestjs-i18n';

@Injectable()
export class PostService {
  constructor(
      @InjectRepository(Post) 
      private readonly postsRepository: Repository<Post> 
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postsRepository.create({
      ...createPostDto,
      user: { id: createPostDto.user_id }, 
    });
    return this.postsRepository.save(post);
  }

  async findAll(page: number, limit: number): Promise<[Post[], number]> {
    const [result, total] =  await this.postsRepository
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
      .orderBy('post.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return [result, total];
  }

  async findAllByUser(user_id: number, page: number, limit: number): Promise<[Post[], number]>{
    const [result, total] = await this.postsRepository
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
      .where('user.id = :user_id', { user_id })
      .orderBy('post.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    
    return [result, total];
  }

  async findPostById(id: number): Promise<Post | null> {
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

  async update(id: number, updatePostDto: UpdatePostDto, @I18n() i18n: I18nContext): Promise<Post | null> {
    const post = await this.postsRepository.findOne({ where: { id }, relations: ['user'] });
    
    if (!post) {
      throw new BadRequestException(i18n.t('post.not_found'));
    }
    
    await this.postsRepository.update(id, updatePostDto);
    return this.postsRepository.findOne({ where: { id } });
  }

  async remove(id: number, message: string): Promise<Post> {
    const post = await this.postsRepository.findOne({ where: { id }, relations: ['user'] });
    if (!post) {
      throw new NotFoundException(message);
    }
    await this.postsRepository.delete(id);
    return post;
  }

}
