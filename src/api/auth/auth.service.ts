import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PasswordService } from '../../password/password.service';
import {
  SignupDto,
  SigninDto,
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
    return uuidv4();
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
    if (!admin.jti || !(admin.jtiExpiresAt && admin.jtiExpiresAt > new Date()))
      throw new BadRequestException('Please login first');
    await this.cache.deleteCache(`${Role.ADMIN}:${admin.jti}`);
    await this.prisma.admin.update({
      where: { id: admin.id },
      data: { jti: null, jtiExpiresAt: null },
    });
    return { success: true };
  }

  async adminRefresh(user: User): Promise<RefreshResponseDto> {
    const admin = await this.prisma.admin.findFirst({
      where: { id: Number(user.id) },
    });
    if (!admin) throw new NotFoundException('User not found');
    await this.cache.deleteCache(`${Role.ADMIN}:${admin.jti}`);
    const generatedJti = this.generateJti();
    const updated = await this.prisma.admin.update({
      where: { id: admin.id },
      data: {
        jti: generatedJti,
        jtiExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    const accessTokenPayload: AccessTokenPayload = {
      sub: updated.id.toString(),
      username: updated.username,
      role: Role.ADMIN,
    };
    const accessToken = this.jwt.sign(accessTokenPayload, {
      secret: this.config.accessTokenSecret,
      expiresIn: '1h',
    });
    const refreshTokenPayload: RefreshTokenPayload = {
      sub: updated.id.toString(),
      jti: generatedJti,
      role: Role.ADMIN,
    };
    const refreshToken = this.jwt.sign(refreshTokenPayload, {
      secret: this.config.refreshTokenSecret,
      expiresIn: '7d',
    });
    await this.cache.setCache(
      `${Role.ADMIN}:${updated.username}`,
      JSON.stringify({
        id: updated.id,
        username: updated.username,
        name: updated.name,
        phone: updated.phone,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      }),
    );
    await this.cache.setCache(
      `${Role.ADMIN}:${updated.jti}`,
      JSON.stringify({
        id: updated.id,
        username: updated.username,
        name: updated.name,
        phone: updated.phone,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      }),
    );
    return {
      tokens: { accessToken, refreshToken, expiresIn: 3600 },
    };
  }

  async salesRepSignup(dto: SignupDto): Promise<SignupResponseDto> {
    const exists = await this.prisma.salesRep.findUnique({
      where: { username: dto.username },
    });
    if (exists) throw new BadRequestException('Username is already taken');
    const hashedPassword = await this.password.hashPassword(dto.password);
    const generatedJti = this.generateJti();
    const created = await this.prisma.salesRep.create({
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
      role: Role.SALES_REPRESENTATIVE,
    };
    const accessToken = this.jwt.sign(accessTokenPayload, {
      secret: this.config.accessTokenSecret,
      expiresIn: '1h',
    });
    const refreshTokenPayload: RefreshTokenPayload = {
      sub: created.id.toString(),
      jti: generatedJti,
      role: Role.SALES_REPRESENTATIVE,
    };
    const refreshToken = this.jwt.sign(refreshTokenPayload, {
      secret: this.config.refreshTokenSecret,
      expiresIn: '7d',
    });
    await this.cache.setCache(
      `${Role.SALES_REPRESENTATIVE}:${created.username}`,
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
      `${Role.SALES_REPRESENTATIVE}:${created.jti}`,
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

  async salesRepSignin(dto: SigninDto): Promise<SigninResponseDto> {
    const salesRep = await this.prisma.salesRep.findUnique({
      where: { username: dto.username },
    });
    if (!salesRep)
      throw new UnauthorizedException('Invalid username or password');
    const valid = await this.password.verifyPassword(
      salesRep.passwordHash,
      dto.password,
    );
    if (!valid) throw new UnauthorizedException('Invalid username or password');
    const generatedJti = this.generateJti();
    await this.prisma.salesRep.update({
      where: { id: salesRep.id },
      data: {
        jti: generatedJti,
        jtiExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    const accessTokenPayload: AccessTokenPayload = {
      sub: salesRep.id.toString(),
      username: salesRep.username,
      role: Role.SALES_REPRESENTATIVE,
    };
    const refreshTokenPayload: RefreshTokenPayload = {
      sub: salesRep.id.toString(),
      jti: generatedJti,
      role: Role.SALES_REPRESENTATIVE,
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
      `${Role.SALES_REPRESENTATIVE}:${salesRep.username}`,
      JSON.stringify({
        id: salesRep.id,
        username: salesRep.username,
        name: salesRep.name,
        phone: salesRep.phone,
        createdAt: salesRep.createdAt,
        updatedAt: salesRep.updatedAt,
      }),
    );
    await this.cache.setCache(
      `${Role.SALES_REPRESENTATIVE}:${generatedJti}`,
      JSON.stringify({
        id: salesRep.id,
        username: salesRep.username,
        name: salesRep.name,
        phone: salesRep.phone,
        createdAt: salesRep.createdAt,
        updatedAt: salesRep.updatedAt,
      }),
    );
    return {
      id: salesRep.id,
      username: salesRep.username,
      name: salesRep.name,
      phone: salesRep.phone,
      tokens: { accessToken, refreshToken, expiresIn: 3600 },
    };
  }

  async salesRepLogout(user: User): Promise<LogoutResponseDto> {
    const salesRep = await this.prisma.salesRep.findFirst({
      where: { username: user.username },
    });
    if (!salesRep) throw new NotFoundException('User not found');
    if (
      !salesRep.jti ||
      !(salesRep.jtiExpiresAt && salesRep.jtiExpiresAt > new Date())
    )
      throw new BadRequestException('Please login first');
    await this.cache.deleteCache(
      `${Role.SALES_REPRESENTATIVE}:${salesRep.jti}`,
    );
    await this.prisma.salesRep.update({
      where: { id: salesRep.id },
      data: { jti: null, jtiExpiresAt: null },
    });
    return { success: true };
  }

  async salesRepRefresh(user: User): Promise<RefreshResponseDto> {
    const salesRep = await this.prisma.salesRep.findFirst({
      where: { id: Number(user.id) },
    });
    if (!salesRep) throw new NotFoundException('User not found');
    await this.cache.deleteCache(
      `${Role.SALES_REPRESENTATIVE}:${salesRep.jti}`,
    );
    const generatedJti = this.generateJti();
    const updated = await this.prisma.salesRep.update({
      where: { id: salesRep.id },
      data: {
        jti: generatedJti,
        jtiExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    const accessTokenPayload: AccessTokenPayload = {
      sub: updated.id.toString(),
      username: updated.username,
      role: Role.SALES_REPRESENTATIVE,
    };
    const accessToken = this.jwt.sign(accessTokenPayload, {
      secret: this.config.accessTokenSecret,
      expiresIn: '1h',
    });
    const refreshTokenPayload: RefreshTokenPayload = {
      sub: updated.id.toString(),
      jti: generatedJti,
      role: Role.SALES_REPRESENTATIVE,
    };
    const refreshToken = this.jwt.sign(refreshTokenPayload, {
      secret: this.config.refreshTokenSecret,
      expiresIn: '7d',
    });
    await this.cache.setCache(
      `${Role.SALES_REPRESENTATIVE}:${updated.username}`,
      JSON.stringify({
        id: updated.id,
        username: updated.username,
        name: updated.name,
        phone: updated.phone,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      }),
    );
    await this.cache.setCache(
      `${Role.SALES_REPRESENTATIVE}:${updated.jti}`,
      JSON.stringify({
        id: updated.id,
        username: updated.username,
        name: updated.name,
        phone: updated.phone,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      }),
    );
    return {
      tokens: { accessToken, refreshToken, expiresIn: 3600 },
    };
  }
}
