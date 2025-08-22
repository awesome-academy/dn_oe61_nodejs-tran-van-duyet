import {
  Controller,
  Get,
  Post as PostMethod,
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
import { LikeService } from '../like/like.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { Post } from 'src/entities/Post.entity'; // Import entity Post
import { PostListResponseDto } from './dto/post-list-response.dto';
import { SinglePostResponseDto, UpdatePostResponseDto, LikePostResponseDto } from './dto/post-response.dto';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly likeService: LikeService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuardUser)
  @PostMethod()
  @ApiOperation({ summary: 'Tạo một bài viết mới' })
  @ApiResponse({
    status: 201,
    description: 'Tạo bài viết thành công.',
    type: SinglePostResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Chưa xác thực.' })
  @UseGuards(JwtAuthGuardUser)
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
  @ApiOperation({ summary: 'Lấy danh sách tất cả bài viết (phân trang)' })
  @ApiQuery({ name: 'page', required: false, description: 'Số trang', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Số lượng mỗi trang', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Thành công.',
    type: PostListResponseDto,
  })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuardUser)
  @Get('user')
  @ApiOperation({ summary: 'Lấy danh sách bài viết của người dùng đã đăng nhập' })
  @ApiQuery({ name: 'page', required: false, description: 'Số trang', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Số lượng mỗi trang', type: Number })
  @ApiResponse({ status: 200, description: 'Thành công.', type: PostListResponseDto })
  @ApiResponse({ status: 401, description: 'Chưa xác thực.' })
  async findAllByUser(
    @User() user,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @I18n() i18n: I18nContext
  ) {
    const pageNumber = Math.max(1, Number(page));
    const pageSize = Math.max(1, Number(limit));
    const [post, total] = await this.postService.findAllByUser(
      +user.sub,
      pageNumber,
      pageSize,
      i18n
    );
    const totalPages = Math.ceil(total / pageSize);

    return {
      post,
      currentPage: pageNumber,
      totalPages,
      limit: pageSize,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Tìm một bài viết theo ID' })
  @ApiParam({ name: 'id', description: 'ID của bài viết', type: Number })
  @ApiResponse({ status: 200, description: 'Thành công.', type: Post })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài viết.' })
  async findOne(@ParseId('id') id: number,@I18n() i18n: I18nContext) {
    const post = await this.postService.findPostById(id, i18n);
    return { data: post };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuardUser)
  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật một bài viết' })
  @ApiParam({ name: 'id', description: 'ID của bài viết cần cập nhật', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thành công.',
    type: UpdatePostResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Chưa xác thực.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài viết.' })
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
      data: post,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuardUser)
  @Delete(':id')
  @ApiOperation({ summary: 'Xóa một bài viết' })
  @ApiParam({ name: 'id', description: 'ID của bài viết cần xóa', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Xóa thành công.',
    type: SinglePostResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Chưa xác thực.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài viết.' })
  async remove(@ParseId('id') id: number, @I18n() i18n: I18nContext) {
    const post = await this.postService.remove(id, i18n.t('post.not_found'));
    return {
      message: i18n.t('post.delete_success'),
      data: post,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuardUser)
  @PostMethod(':id/like')
  @ApiOperation({ summary: 'Like một bài viết' })
  @ApiParam({ name: 'id', description: 'ID của bài viết để like', type: Number })
  @ApiResponse({ status: 200, description: 'Thành công.', type: LikePostResponseDto })
  @ApiResponse({ status: 401, description: 'Chưa xác thực.' })
  async likePost(
    @User() user,
    @ParseId('id') id: number,
    @I18n() i18n: I18nContext,
  ) {
    const existingLike = await this.likeService.hasUserLikedPost(id, +user.sub);
    if (existingLike) {
      return {
        status: false,
        message: i18n.t('like.like_exit'),
      };
    }
    const like = await this.likeService.like(id, +user.sub, i18n);
    return {
      status: true,
      message: i18n.t('like.like_success'),
      data: like,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuardUser)
  @Delete(':id/unlike')
  @ApiOperation({ summary: 'Unlike một bài viết' })
  @ApiParam({ name: 'id', description: 'ID của bài viết để unlike', type: Number })
  @ApiResponse({ status: 200, description: 'Thành công.', type: LikePostResponseDto })
  @ApiResponse({ status: 401, description: 'Chưa xác thực.' })
  async unLikePost(
    @User() user,
    @ParseId('id') id: number,
    @I18n() i18n: I18nContext,
  ) {
    console.log(id);
    const existingLike = await this.likeService.hasUserLikedPost(id, +user.sub);
    if (existingLike) {
      const unlike = await this.likeService.unLike(id, +user.sub, i18n);
      return {
        status: true,
        message: i18n.t('like.unlike_success'),
        data: unlike,
      };
    }
    return {
      status: false,
      message: i18n.t('like.like_not_found'),
    };
  }
}
