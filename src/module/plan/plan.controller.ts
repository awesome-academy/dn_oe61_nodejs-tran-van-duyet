import {
  Controller,
  Get
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ParseId } from 'src/common/decorators/parse-id.decorator';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { PlanListResponseDto } from './dto/plan-list-response.dto';
import { PlanResponseDto } from './dto/plan-response.dto';

@ApiTags('Plan')
@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả các gói' })
  @ApiResponse({ status: 200, description: 'Thành công.', type: PlanListResponseDto })
  async findAll() {
    const data = await this.planService.findAll();
    return {data: data};
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết của một gói' })
  @ApiParam({ name: 'id', description: 'ID của gói' })
  @ApiResponse({ status: 200, description: 'Thành công.', type: PlanResponseDto })
  @ApiResponse({ status: 404, description: 'Không tìm thấy gói.' })
  async findOne(@ParseId('id') id: number, @I18n() i18n: I18nContext) {
    const data = await this.planService.findOne(id);
    return {data: data};
  }
}
