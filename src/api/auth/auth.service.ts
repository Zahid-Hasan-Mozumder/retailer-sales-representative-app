import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PasswordService } from '../../password/password.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { TokenDto } from './dto/token.dto';
import { SignupResponseDto } from './dto/signup-response.dto';
import { SigninResponseDto } from './dto/signin-response.dto';
import { LogoutResponseDto } from './dto/logout-response.dto';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../../config/config.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Role } from './enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly password: PasswordService,
    private readonly config: ConfigService,
  ) {}

  async adminSignup(dto: SignupDto): Promise<SignupResponseDto> {
    const exists = await this.prisma.admin.findUnique({
      where: { username: dto.username },
    });
    if (exists) throw new BadRequestException('Username is already taken');
    const hashedPassword = await this.password.hashPassword(dto.password);
    const created = await this.prisma.admin.create({
      data: {
        username: dto.username,
        name: dto.name,
        phone: dto.phone,
        passwordHash: hashedPassword,
      },
    });
    const payload: JwtPayload = { sub: created.id, username: created.username, role: Role.Admin, iat: Date.now(), exp: Date.now() + 1000 * 60 * 60 };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.accessTokenSecret(),
      expiresIn: '1h',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.refreshTokenSecret(),
      expiresIn: '7d',
    });
    await this.prisma.admin.update({
      where: { id: created.id },
      data: { refreshToken: refreshToken },
    });
    return {
      id: created.id,
      username: created.username,
      name: created.name,
      phone: created.phone,
      tokens: { accessToken, refreshToken, expiresIn: '1h' },
    };
  }

  async adminSignin(dto: SigninDto): Promise<SigninResponseDto> {
    const admin = await this.prisma.admin.findUnique({
      where: { username: dto.username },
    });
    if (!admin) throw new UnauthorizedException('Invalid username or password');
    const valid = await this.password.verifyPassword(
      admin.passwordHash,
      dto.password,
    );
    if (!valid) throw new UnauthorizedException('Invalid username or password');
    const payload = { id: admin.id, username: admin.username };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.accessTokenSecret(),
      expiresIn: '1h',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.refreshTokenSecret(),
      expiresIn: '7d',
    });
    await this.prisma.admin.update({
      where: { id: admin.id },
      data: { refreshToken: refreshToken },
    });
    return { id: admin.id, username: admin.username, name: admin.name, tokens: { accessToken, refreshToken, expiresIn: '1h' } };
  }

  async adminLogout(dto: TokenDto): Promise<LogoutResponseDto> {
    const admin = await this.prisma.admin.findFirst({
      where: { refreshToken: dto.refreshToken },
    });
    if (!admin) throw new UnauthorizedException('invalid_refresh_token');
    await this.prisma.admin.update({
      where: { id: admin.id },
      data: { refreshToken: null },
    });
    return { success: true };
  }

  async adminRefresh(dto: TokenDto): Promise<RefreshResponseDto> {
    const admin = await this.prisma.admin.findFirst({
      where: { refreshToken: dto.refreshToken },
    });
    if (!admin) throw new UnauthorizedException('invalid_refresh_token');
    const tokens = this.generateTokens();
    await this.prisma.admin.update({
      where: { id: admin.id },
      data: { refreshToken: tokens.refreshToken },
    });
    return { tokens };
  }

  async salesRepSignup(dto: SignupDto): Promise<SignupResponseDto> {
    const exists = await this.prisma.salesRep.findUnique({
      where: { username: dto.username },
    });
    if (exists) throw new BadRequestException('username_taken');
    const passwordHash = await this.password.hashPassword(dto.password);
    const created = await this.prisma.salesRep.create({
      data: {
        username: dto.username,
        name: dto.name,
        phone: dto.phone,
        passwordHash,
      },
    });
    const tokens = this.generateTokens();
    await this.prisma.salesRep.update({
      where: { id: created.id },
      data: { refreshToken: tokens.refreshToken },
    });
    return {
      id: created.id,
      username: created.username,
      name: created.name,
      phone: created.phone,
      tokens,
    };
  }

  async salesRepSignin(dto: SigninDto): Promise<SigninResponseDto> {
    const user = await this.prisma.salesRep.findUnique({
      where: { username: dto.username },
    });
    if (!user) throw new UnauthorizedException('invalid_credentials');
    const valid = await this.password.verifyPassword(
      user.passwordHash,
      dto.password,
    );
    if (!valid) throw new UnauthorizedException('invalid_credentials');
    const tokens = this.generateTokens();
    await this.prisma.salesRep.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });
    return { id: user.id, username: user.username, name: user.name, tokens };
  }

  async salesRepLogout(dto: TokenDto): Promise<LogoutResponseDto> {
    const user = await this.prisma.salesRep.findFirst({
      where: { refreshToken: dto.refreshToken },
    });
    if (!user) throw new UnauthorizedException('invalid_refresh_token');
    await this.prisma.salesRep.update({
      where: { id: user.id },
      data: { refreshToken: null },
    });
    return { success: true };
  }

  async salesRepRefresh(dto: TokenDto): Promise<RefreshResponseDto> {
    const user = await this.prisma.salesRep.findFirst({
      where: { refreshToken: dto.refreshToken },
    });
    if (!user) throw new UnauthorizedException('invalid_refresh_token');
    const tokens = this.generateTokens();
    await this.prisma.salesRep.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });
    return { tokens };
  }
}
