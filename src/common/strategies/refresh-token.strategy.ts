import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '../../config/config.service';
import { RefreshTokenPayload, User } from '../interfaces';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '../enums';
import { CacheService } from '../../cache/cache.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.refreshTokenSecret,
    });
  }

  async validate(payload: RefreshTokenPayload): Promise<User> {
    if (payload.role === Role.ADMIN) {
      const user = await this.cache.getOrSetCache(
        `${Role.ADMIN}:${payload.jti}`,
        async () => {
          return await this.prisma.admin.findFirst({
            where: { id: Number(payload.sub), jti: payload.jti },
            select: {
              id: true,
              username: true,
              name: true,
              phone: true,
              createdAt: true,
              updatedAt: true,
            },
          });
        },
      );
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      return {
        id: user.id.toString(),
        username: user.username,
        name: user.name,
        phone: user.phone,
        role: Role.ADMIN,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } else {
      const user = await this.cache.getOrSetCache(
        `${Role.SALES_REPRESENTATIVE}:${payload.jti}`,
        async () => {
          return await this.prisma.salesRep.findFirst({
            where: { id: Number(payload.sub), jti: payload.jti },
            select: {
              id: true,
              username: true,
              name: true,
              phone: true,
              createdAt: true,
              updatedAt: true,
            },
          });
        },
      );
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      return {
        id: user.id.toString(),
        username: user.username,
        name: user.name,
        phone: user.phone,
        role: Role.SALES_REPRESENTATIVE,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    }
  }
}
