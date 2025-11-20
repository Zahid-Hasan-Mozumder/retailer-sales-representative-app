import { Controller, Get, Param, Patch, Query, Body } from '@nestjs/common';
import { RetailerService } from './retailer.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import {
  RetailerResponseDto,
  UpdateRetailerDto,
  RetailersQueryDto,
  RetailersQueryResponseDto,
} from './dto';
import { Authorize } from '../../common/decorators';
import { Role } from '../../common/enums';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { User } from '../../common/interfaces';

@ApiTags('retailer')
@ApiBearerAuth()
@Authorize([Role.ADMIN, Role.SALES_REPRESENTATIVE])
@Controller('retailer')
export class RetailerController {
  constructor(private readonly service: RetailerService) {}

  @Get()
  @ApiOperation({ summary: 'Paginated retailers (role-aware)' })
  @ApiResponse({
    status: 200,
    description: 'Retailers fetched',
    type: RetailersQueryResponseDto,
  })
  async list(
    @GetUser() user: User,
    @Query() dto: RetailersQueryDto,
  ): Promise<RetailersQueryResponseDto> {
    return this.service.findAllQuery(dto, user);
  }

  // @Get(':uid')
  // @ApiOperation({ summary: 'Retailer detail' })
  // @ApiParam({ name: 'uid', type: String })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Retailer fetched',
  //   type: RetailerResponseDto,
  // })
  // @ApiResponse({ status: 404, description: 'Not Found' })
  // async getOne(
  //   @GetUser() user: User,
  //   @Param('uid') uid: string,
  // ): Promise<RetailerResponseDto> {
  //   return this.service.findByUid(user, uid);
  // }

  // @Patch(':uid')
  // @ApiOperation({ summary: 'Update allowed fields' })
  // @ApiParam({ name: 'uid', type: String })
  // @ApiBody({ type: UpdateRetailerDto })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Retailer updated',
  //   type: RetailerResponseDto,
  // })
  // @ApiResponse({ status: 404, description: 'Not Found' })
  // async update(
  //   @GetUser() user: User,
  //   @Param('uid') uid: string,
  //   @Body() dto: UpdateRetailerDto,
  // ): Promise<RetailerResponseDto> {
  //   return this.service.update(user, uid, dto);
  // }
}
