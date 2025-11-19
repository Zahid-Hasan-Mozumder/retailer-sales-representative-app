import { Controller, Get, Query } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { CsvService } from './csv.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { Authorize } from '../common/decorators';
import { Role } from '../common/enums';
import { GenerateCsvResponseDto } from './dto';

@ApiTags('csv')
@ApiBearerAuth()
@Authorize([Role.ADMIN])
@Controller('csv')
export class CsvController {
  constructor(private readonly csvService: CsvService) {}

  @Get('generate/retailers')
  @ApiOperation({ summary: 'Generate CSV and save to local file' })
  @ApiQuery({ name: 'count', required: false, example: 2000000 })
  @ApiResponse({
    status: 200,
    description: 'CSV generated',
    type: GenerateCsvResponseDto,
  })
  async generate(
    @Query('count') count: string,
  ): Promise<GenerateCsvResponseDto> {
    const n = count ? Number(count) : 2000000;
    const dir = path.resolve(process.cwd(), 'storage', 'csv');
    fs.mkdirSync(dir, { recursive: true });
    const filePath = path.join(
      dir,
      `retailers_${n}_${Math.floor(Date.now() / 1000)}.csv`,
    );
    const stream = fs.createWriteStream(filePath, { encoding: 'utf8' });
    await this.csvService.generateCsv(n, stream);
    stream.end();
    return { success: true, path: filePath };
  }
}
