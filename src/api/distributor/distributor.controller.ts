import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { DistributorService } from './distributor.service';
import { Authorize } from '../../common/decorators';
import { Role } from '../../common/enums';
import {
  CreateDistributorDto,
  UpdateDistributorDto,
  DistributorResponseDto,
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

@ApiTags('distributor')
@ApiBearerAuth()
@Authorize([Role.ADMIN])
@Controller('distributor')
export class DistributorController {
  constructor(private readonly service: DistributorService) {}

  @Post()
  @ApiOperation({ summary: 'Create distributor' })
  @ApiBody({ type: CreateDistributorDto })
  @ApiResponse({
    status: 201,
    description: 'Distributor created',
    type: DistributorResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(
    @Body() dto: CreateDistributorDto,
  ): Promise<DistributorResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List distributors' })
  @ApiResponse({
    status: 200,
    description: 'Distributors fetched',
    type: DistributorResponseDto,
    isArray: true,
  })
  async findAll(): Promise<DistributorResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get distributor by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Distributor fetched',
    type: DistributorResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async findOne(@Param('id') id: string): Promise<DistributorResponseDto> {
    return this.service.findOne(Number(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update distributor' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateDistributorDto })
  @ApiResponse({
    status: 200,
    description: 'Distributor updated',
    type: DistributorResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateDistributorDto,
  ): Promise<DistributorResponseDto> {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete distributor' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Distributor deleted',
    type: DeleteResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async remove(@Param('id') id: string): Promise<DeleteResponseDto> {
    return this.service.remove(Number(id));
  }
}
