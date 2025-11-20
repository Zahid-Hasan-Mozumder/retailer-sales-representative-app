import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { RegionService } from './region.service';
import { Authorize } from '../../common/decorators';
import { Role } from '../../common/enums';
import { CreateRegionDto, UpdateRegionDto, RegionResponseDto } from './dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { DeleteResponseDto } from '../../common/dto';

@ApiTags('region')
@ApiBearerAuth()
@Authorize([Role.ADMIN])
@Controller('region')
export class RegionController {
  constructor(private readonly service: RegionService) {}

  @Post()
  @ApiOperation({ summary: 'Create region' })
  @ApiBody({ type: CreateRegionDto })
  @ApiResponse({
    status: 201,
    description: 'Region created',
    type: RegionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() dto: CreateRegionDto): Promise<RegionResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List regions' })
  @ApiResponse({
    status: 200,
    description: 'Regions fetched',
    type: RegionResponseDto,
    isArray: true,
  })
  async findAll(): Promise<RegionResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get region by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Region fetched',
    type: RegionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async findOne(@Param('id') id: string): Promise<RegionResponseDto> {
    return this.service.findOne(Number(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update region' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateRegionDto })
  @ApiResponse({
    status: 200,
    description: 'Region updated',
    type: RegionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRegionDto,
  ): Promise<RegionResponseDto> {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete region' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Region deleted',
    type: DeleteResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async remove(@Param('id') id: string): Promise<DeleteResponseDto> {
    return this.service.remove(Number(id));
  }
}
