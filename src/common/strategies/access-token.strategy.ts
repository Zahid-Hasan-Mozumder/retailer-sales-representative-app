import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '../../config/config.service';
import { AccessTokenPayload, User } from '../interfaces';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '../enums';
import { CacheService } from '../../cache/cache.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.accessTokenSecret,
    });
  }

  async validate(payload: AccessTokenPayload): Promise<User> {
    if (payload.role === Role.ADMIN) {
      const user = await this.cache.getOrSetCache(
        `${Role.ADMIN}:${payload.username}`,
        async () => {
          return await this.prisma.admin.findFirst({
            where: { id: Number(payload.sub) },
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
        throw new UnauthorizedException('User not found');
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
        `${Role.SALES_REPRESENTATIVE}:${payload.username}`,
        async () => {
          return await this.prisma.salesRep.findFirst({
            where: { id: Number(payload.sub) },
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
        throw new UnauthorizedException('User not found');
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
