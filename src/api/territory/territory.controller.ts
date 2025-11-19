import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { TerritoryService } from './territory.service';
import { Authorize } from '../../common/decorators';
import { Role } from '../../common/enums';
import {
  CreateTerritoryDto,
  UpdateTerritoryDto,
  TerritoryResponseDto,
} from './dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { DeleteResponseDto } from '../../common/dto';

@ApiTags('territory')
@ApiBearerAuth()
@Authorize([Role.ADMIN])
@Controller('territory')
export class TerritoryController {
  constructor(private readonly service: TerritoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create territory' })
  @ApiBody({ type: CreateTerritoryDto })
  @ApiResponse({
    status: 201,
    description: 'Territory created',
    type: TerritoryResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async create(@Body() dto: CreateTerritoryDto): Promise<TerritoryResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List territories' })
  @ApiResponse({
    status: 200,
    description: 'Territories fetched',
    type: TerritoryResponseDto,
    isArray: true,
  })
  async findAll(): Promise<TerritoryResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get territory by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Territory fetched',
    type: TerritoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async findOne(@Param('id') id: string): Promise<TerritoryResponseDto> {
    return this.service.findOne(Number(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update territory' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateTerritoryDto })
  @ApiResponse({
    status: 200,
    description: 'Territory updated',
    type: TerritoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTerritoryDto,
  ): Promise<TerritoryResponseDto> {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete territory' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Territory deleted',
    type: DeleteResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async remove(@Param('id') id: string): Promise<DeleteResponseDto> {
    return this.service.remove(Number(id));
  }
}
