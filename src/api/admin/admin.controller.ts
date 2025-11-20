import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminService } from './admin.service';
import { Authorize } from '../../common/decorators';
import { Role } from '../../common/enums';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ImportRetailersResponseDto,
  ImportRetailersDto,
  BulkAssignResponseDto,
  BulkUnassignResponseDto,
  BulkAssignDto,
  BulkUnassignDto,
} from './dto';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiBearerAuth()
  @Authorize([Role.ADMIN])
  @Post('import/retailers')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Import retailers from CSV' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: ImportRetailersDto })
  @ApiResponse({
    status: 200,
    description: 'Import completed',
    type: ImportRetailersResponseDto,
  })
  async importRetailers(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ImportRetailersResponseDto> {
    if (!file)
      throw new BadRequestException('CSV file missing. Use field name "file".');
    const stats = await this.adminService.importRetailersFromCsv(file.path);
    return stats as ImportRetailersResponseDto;
  }

  @ApiBearerAuth()
  @Authorize([Role.ADMIN])
  @Post('assign/retailers/bulk')
  @ApiOperation({ summary: 'Bulk assign retailers to sales rep' })
  @ApiBody({ type: BulkAssignDto })
  @ApiResponse({
    status: 200,
    description: 'Assignment completed',
    type: BulkAssignResponseDto,
  })
  async bulkAssign(@Body() dto: BulkAssignDto): Promise<BulkAssignResponseDto> {
    return await this.adminService.bulkAssignRetailers(dto);
  }

  @ApiBearerAuth()
  @Authorize([Role.ADMIN])
  @Post('unassign/retailers/bulk')
  @ApiOperation({ summary: 'Bulk unassign retailers from any sales rep' })
  @ApiBody({ type: BulkUnassignDto })
  @ApiResponse({
    status: 200,
    description: 'Unassignment completed',
    type: BulkUnassignResponseDto,
  })
  async bulkUnassign(
    @Body() dto: BulkUnassignDto,
  ): Promise<BulkUnassignResponseDto> {
    return await this.adminService.bulkUnassignRetailers(dto);
  }
}
