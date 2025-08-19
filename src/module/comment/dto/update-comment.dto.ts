import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCommentDto } from './create-comment.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
    @ApiProperty({ description: 'Nội dung mới của bình luận', example: 'Tôi đã thay đổi ý kiến.', required: false })
    @IsOptional()
    @IsString()
    content?: string;
}
