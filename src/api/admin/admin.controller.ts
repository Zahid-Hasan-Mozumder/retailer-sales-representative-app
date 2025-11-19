import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
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
import { ImportRetailersResponseDto, ImportRetailersDto } from './dto';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly service: AdminService) {}

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
    const stats = await this.service.importRetailersFromCsv(file.path);
    return stats as ImportRetailersResponseDto;
  }
}
