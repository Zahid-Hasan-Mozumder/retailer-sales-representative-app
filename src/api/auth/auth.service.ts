import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PasswordService } from '../../password/password.service';
import {
  SignupDto,
  SigninDto,
  TokenDto,
  SignupResponseDto,
  SigninResponseDto,
  LogoutResponseDto,
  RefreshResponseDto,
} from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../../config/config.service';
import {
  AccessTokenPayload,
  RefreshTokenPayload,
  User,
} from '../../common/interfaces';
import { Role } from '../../common/enums';
import { v4 as uuidv4 } from 'uuid';
import { CacheService } from '../../cache/cache.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly password: PasswordService,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
    private readonly cache: CacheService,
  ) {}

  generateJti(): string {
    return uuidv4() as string;
  }

  async adminSignup(dto: SignupDto): Promise<SignupResponseDto> {
    const exists = await this.prisma.admin.findUnique({
      where: { username: dto.username },
    });
    if (exists) throw new BadRequestException('Username is already taken');
    const hashedPassword = await this.password.hashPassword(dto.password);
    const generatedJti = this.generateJti();
    const created = await this.prisma.admin.create({
      data: {
        username: dto.username,
        name: dto.name,
        phone: dto.phone,
        passwordHash: hashedPassword,
        jti: generatedJti,
        jtiExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    const accessTokenPayload: AccessTokenPayload = {
      sub: created.id.toString(),
      username: created.username,
      role: Role.ADMIN,
    };
    const accessToken = this.jwt.sign(accessTokenPayload, {
      secret: this.config.accessTokenSecret,
      expiresIn: '1h',
    });
    const refreshTokenPayload: RefreshTokenPayload = {
      sub: created.id.toString(),
      jti: generatedJti,
      role: Role.ADMIN,
    };
    const refreshToken = this.jwt.sign(refreshTokenPayload, {
      secret: this.config.refreshTokenSecret,
      expiresIn: '7d',
    });
    await this.cache.setCache(
      `${Role.ADMIN}:${created.username}`,
      JSON.stringify({
        id: created.id,
        username: created.username,
        name: created.name,
        phone: created.phone,
        createdAt: created.createdAt,
        updatedAt: created.updatedAt,
      }),
    );
    await this.cache.setCache(
      `${Role.ADMIN}:${created.jti}`,
      JSON.stringify({
        id: created.id,
        username: created.username,
        name: created.name,
        phone: created.phone,
        createdAt: created.createdAt,
        updatedAt: created.updatedAt,
      }),
    );
    return {
      id: created.id,
      username: created.username,
      name: created.name,
      phone: created.phone,
      tokens: { accessToken, refreshToken, expiresIn: 3600 },
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
    const generatedJti = this.generateJti();
    await this.prisma.admin.update({
      where: { id: admin.id },
      data: {
        jti: generatedJti,
        jtiExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    const accessTokenPayload: AccessTokenPayload = {
      sub: admin.id.toString(),
      username: admin.username,
      role: Role.ADMIN,
    };
    const refreshTokenPayload: RefreshTokenPayload = {
      sub: admin.id.toString(),
      jti: generatedJti,
      role: Role.ADMIN,
    };
    const accessToken = this.jwt.sign(accessTokenPayload, {
      secret: this.config.accessTokenSecret,
      expiresIn: '1h',
    });
    const refreshToken = this.jwt.sign(refreshTokenPayload, {
      secret: this.config.refreshTokenSecret,
      expiresIn: '7d',
    });
    await this.cache.setCache(
      `${Role.ADMIN}:${admin.username}`,
      JSON.stringify({
        id: admin.id,
        username: admin.username,
        name: admin.name,
        phone: admin.phone,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      }),
    );
    await this.cache.setCache(
      `${Role.ADMIN}:${generatedJti}`,
      JSON.stringify({
        id: admin.id,
        username: admin.username,
        name: admin.name,
        phone: admin.phone,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      }),
    );
    return {
      id: admin.id,
      username: admin.username,
      name: admin.name,
      phone: admin.phone,
      tokens: { accessToken, refreshToken, expiresIn: 3600 },
    };
  }

  async adminLogout(user: User): Promise<LogoutResponseDto> {
    const admin = await this.prisma.admin.findFirst({
      where: { username: user.username },
    });
    if (!admin) throw new NotFoundException('User not found');
    await this.cache.deleteCache(`${Role.ADMIN}:${admin.jti}`);
    await this.prisma.admin.update({
      where: { id: admin.id },
      data: { jti: null, jtiExpiresAt: null },
    });
    return { success: true };
  }

  // async adminRefresh(dto: TokenDto): Promise<RefreshResponseDto> {
  //   const admin = await this.prisma.admin.findFirst({
  //     where: { refreshToken: dto.refreshToken },
  //   });
  //   if (!admin) throw new UnauthorizedException('invalid_refresh_token');
  //   const tokens = this.generateTokens();
  //   await this.prisma.admin.update({
  //     where: { id: admin.id },
  //     data: { refreshToken: tokens.refreshToken },
  //   });
  //   return { tokens };
  // }

  // async salesRepSignup(dto: SignupDto): Promise<SignupResponseDto> {
  //   const exists = await this.prisma.salesRep.findUnique({
  //     where: { username: dto.username },
  //   });
  //   if (exists) throw new BadRequestException('username_taken');
  //   const passwordHash = await this.password.hashPassword(dto.password);
  //   const created = await this.prisma.salesRep.create({
  //     data: {
  //       username: dto.username,
  //       name: dto.name,
  //       phone: dto.phone,
  //       passwordHash,
  //     },
  //   });
  //   const tokens = this.generateTokens();
  //   await this.prisma.salesRep.update({
  //     where: { id: created.id },
  //     data: { refreshToken: tokens.refreshToken },
  //   });
  //   return {
  //     id: created.id,
  //     username: created.username,
  //     name: created.name,
  //     phone: created.phone,
  //     tokens,
  //   };
  // }

  // async salesRepSignin(dto: SigninDto): Promise<SigninResponseDto> {
  //   const user = await this.prisma.salesRep.findUnique({
  //     where: { username: dto.username },
  //   });
  //   if (!user) throw new UnauthorizedException('invalid_credentials');
  //   const valid = await this.password.verifyPassword(
  //     user.passwordHash,
  //     dto.password,
  //   );
  //   if (!valid) throw new UnauthorizedException('invalid_credentials');
  //   const tokens = this.generateTokens();
  //   await this.prisma.salesRep.update({
  //     where: { id: user.id },
  //     data: { refreshToken: tokens.refreshToken },
  //   });
  //   return { id: user.id, username: user.username, name: user.name, tokens };
  // }

  // async salesRepLogout(dto: TokenDto): Promise<LogoutResponseDto> {
  //   const user = await this.prisma.salesRep.findFirst({
  //     where: { refreshToken: dto.refreshToken },
  //   });
  //   if (!user) throw new UnauthorizedException('invalid_refresh_token');
  //   await this.prisma.salesRep.update({
  //     where: { id: user.id },
  //     data: { refreshToken: null },
  //   });
  //   return { success: true };
  // }

  // async salesRepRefresh(dto: TokenDto): Promise<RefreshResponseDto> {
  //   const user = await this.prisma.salesRep.findFirst({
  //     where: { refreshToken: dto.refreshToken },
  //   });
  //   if (!user) throw new UnauthorizedException('invalid_refresh_token');
  //   const tokens = this.generateTokens();
  //   await this.prisma.salesRep.update({
  //     where: { id: user.id },
  //     data: { refreshToken: tokens.refreshToken },
  //   });
  //   return { tokens };
  // }
}
