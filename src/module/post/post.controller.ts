import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuardUser } from '../auth/jwt-auth.guard-user';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuardUser)
  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: Request,
    @I18n() i18n: I18nContext,
  ) {
    const user = req['user'];
    const t = i18n.t('post') as any;
    createPostDto.user_id = user.sub;
    this.postService.create(createPostDto);
    return { message: t.create_success };
  }

  @Get()
  async findAll(@Req() req: Request) {
    return this.postService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @UseGuards(JwtAuthGuardUser)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: Request,
    @I18n() i18n: I18nContext,
  ) {
    const user = req['user'];
    const t = i18n.t('post') as any;
    const user_id = user.sub;
    const post = await this.postService.update(+id, +user_id, updatePostDto);
    console.log(post);

    if (!post) {
      throw new BadRequestException(t.no_permission_update_post);
    }
    return { message: t.update_success };
  }

  @UseGuards(JwtAuthGuardUser)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @I18n() i18n: I18nContext,
    @Req() req: Request,
  ) {
    const user = req['user'];
    const user_id = user.sub;
    const t = i18n.t('post') as any;
    const post = await this.postService.remove(+id, user_id);
    if (!post) {
      throw new BadRequestException(t.delete_error);
    }
    return { message: t.delete_success };
  }
}
