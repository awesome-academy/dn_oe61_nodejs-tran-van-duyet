import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Put,
  UseGuards,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuardUser } from '../auth/jwt-auth.guard-user';
import { I18n, I18nContext } from 'nestjs-i18n';
import { User } from 'src/common/decorators/user.decorator';
import { ParseId } from 'src/common/decorators/parse-id.decorator';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuardUser)
  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @User() user,
    @I18n() i18n: I18nContext,
  ) {
    createPostDto.user_id = user.sub;
    const post = await this.postService.create(createPostDto);
    return { message: i18n.t('post.create_success'), data: post };
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ) {
    const pageNumber = Math.max(1, Number(page));
    const pageSize = Math.max(1, Number(limit));
    const [post, total] = await this.postService.findAll(pageNumber, pageSize);
    const totalPages = Math.ceil(total / pageSize);
    return {
      post,
      currentPage: pageNumber,
      totalPages,
      limit: pageSize,
    };
  }

  @UseGuards(JwtAuthGuardUser)
  @Get('user')
  async findAllByUser(
    @User() user,
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ) {
    const pageNumber = Math.max(1, Number(page));
    const pageSize = Math.max(1, Number(limit));
    const [post, total] = await this.postService.findAllByUser(+user.sub, pageNumber, pageSize);
    const totalPages = Math.ceil(total / pageSize);
    
    return {
      post,
      currentPage: pageNumber,
      totalPages,
      limit: pageSize,
    };
  }

  @Get(':id')
  async findOne(@ParseId('id') id: number) {
    const post = await this.postService.findPostById(id);
    return { data: post }
  }

  @UseGuards(JwtAuthGuardUser)
  @Put(':id')
  async update(
    @ParseId('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
    @I18n() i18n: I18nContext,
  ) {
    const post = await this.postService.update(id, updatePostDto, i18n);

    if (!post) {
      throw new BadRequestException(i18n.t('post.no_permission_update_post'));
    }
    return {
      message: i18n.t('post.update_success'),
      data: post
    };
  }

  @UseGuards(JwtAuthGuardUser)
  @Delete(':id')
  async remove(
    @ParseId('id') id: number,
    @I18n() i18n: I18nContext,
  ) {
    const post = await this.postService.remove(id, i18n.t('post.not_found'));
    return {
      message: i18n.t('post.delete_success'), 
      data: post
    };
  }
}
