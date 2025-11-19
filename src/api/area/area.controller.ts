import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { AreaService } from './area.service';
import { Authorize } from '../../common/decorators';
import { Role } from '../../common/enums';
import { CreateAreaDto, UpdateAreaDto, AreaResponseDto } from './dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { DeleteResponseDto } from '../../common/dto';

@ApiTags('area')
@ApiBearerAuth()
@Authorize([Role.ADMIN])
@Controller('area')
export class AreaController {
  constructor(private readonly service: AreaService) {}

  @Post()
  @ApiOperation({ summary: 'Create area' })
  @ApiBody({ type: CreateAreaDto })
  @ApiResponse({
    status: 201,
    description: 'Area created',
    type: AreaResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async create(@Body() dto: CreateAreaDto): Promise<AreaResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List areas' })
  @ApiResponse({
    status: 200,
    description: 'Areas fetched',
    type: AreaResponseDto,
    isArray: true,
  })
  async findAll(): Promise<AreaResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get area by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Area fetched',
    type: AreaResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async findOne(@Param('id') id: string): Promise<AreaResponseDto> {
    return this.service.findOne(Number(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update area' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateAreaDto })
  @ApiResponse({
    status: 200,
    description: 'Area updated',
    type: AreaResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAreaDto,
  ): Promise<AreaResponseDto> {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete area' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Area deleted',
    type: DeleteResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async remove(@Param('id') id: string): Promise<DeleteResponseDto> {
    return this.service.remove(Number(id));
  }
}
