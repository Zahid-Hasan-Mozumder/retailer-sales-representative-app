import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SignupDto,
  SigninDto,
  SignupResponseDto,
  SigninResponseDto,
  LogoutResponseDto,
  RefreshResponseDto,
} from './dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Authorize, GetUser, Refresh } from '../../common/decorators';
import { Role } from '../../common/enums';
import { User } from '../../common/interfaces';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/signup')
  @ApiOperation({ summary: 'Admin signup' })
  @ApiBody({ type: SignupDto })
  @ApiResponse({
    status: 201,
    description: 'Admin signed up successfully',
    type: SignupResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async adminSignup(@Body() dto: SignupDto): Promise<SignupResponseDto> {
    return this.authService.adminSignup(dto);
  }

  @Post('admin/signin')
  @ApiOperation({ summary: 'Admin signin' })
  @ApiBody({ type: SigninDto })
  @ApiResponse({
    status: 200,
    description: 'Admin signed in successfully',
    type: SigninResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async adminSignin(@Body() dto: SigninDto): Promise<SigninResponseDto> {
    return this.authService.adminSignin(dto);
  }

  @Authorize([Role.ADMIN])
  @Post('admin/logout')
  @ApiOperation({ summary: 'Admin logout' })
  @ApiResponse({
    status: 200,
    description: 'Admin logged out successfully',
    type: LogoutResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async adminLogout(@GetUser() user: User): Promise<LogoutResponseDto> {
    return this.authService.adminLogout(user);
  }

  @Refresh([Role.ADMIN])
  @Post('admin/refresh')
  @ApiOperation({ summary: 'Refresh admin tokens' })
  @ApiResponse({
    status: 200,
    description: 'Tokens refreshed successfully',
    type: RefreshResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async adminRefresh(@GetUser() user: User): Promise<RefreshResponseDto> {
    return this.authService.adminRefresh(user);
  }

  @Post('sales-rep/signup')
  @ApiOperation({ summary: 'Sales representative signup' })
  @ApiBody({ type: SignupDto })
  @ApiResponse({
    status: 201,
    description: 'Sales rep signed up successfully',
    type: SignupResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async salesRepSignup(@Body() dto: SignupDto): Promise<SignupResponseDto> {
    return this.authService.salesRepSignup(dto);
  }

  @Post('sales-rep/signin')
  @ApiOperation({ summary: 'Sales representative signin' })
  @ApiBody({ type: SigninDto })
  @ApiResponse({
    status: 200,
    description: 'Sales rep signed in successfully',
    type: SigninResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async salesRepSignin(@Body() dto: SigninDto): Promise<SigninResponseDto> {
    return this.authService.salesRepSignin(dto);
  }

  @Authorize([Role.SALES_REPRESENTATIVE])
  @Post('sales-rep/logout')
  @ApiOperation({ summary: 'Sales representative logout' })
  @ApiResponse({
    status: 200,
    description: 'Sales rep logged out successfully',
    type: LogoutResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async salesRepLogout(@GetUser() user: User): Promise<LogoutResponseDto> {
    return this.authService.salesRepLogout(user);
  }

  @Refresh([Role.SALES_REPRESENTATIVE])
  @Post('sales-rep/refresh')
  @ApiOperation({ summary: 'Refresh sales representative tokens' })
  @ApiResponse({
    status: 200,
    description: 'Tokens refreshed successfully',
    type: RefreshResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async salesRepRefresh(@GetUser() user: User): Promise<RefreshResponseDto> {
    return this.authService.salesRepRefresh(user);
  }
}
