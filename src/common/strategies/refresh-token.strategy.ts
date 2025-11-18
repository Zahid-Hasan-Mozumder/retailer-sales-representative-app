import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '../../config/config.service';
import { User } from '../interfaces';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '../enums';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.refreshTokenSecret!,
    });
  }

  async validate(payload: any): Promise<User> {
    // const user = (await this.adminModel.findById(payload.sub)) as Admin & {
    //   _id: any;
    // };
    // if (!user) {
    //   throw new UnauthorizedException('User not found in admin database!');
    // }
    // return {
    //   id: user._id.toString(),
    //   firstName: user.firstName,
    //   lastName: user.lastName,
    //   email: user.email,
    //   phone: user.phone,
    //   role: user.role,
    //   isActive: user.isActive,
    //   createdAt: user.createdAt,
    //   updatedAt: user.updatedAt,
    // };
    const user: User = {
      id: '1',
      username: 'sales-rep-2',
      name: 'Sales Rep 2',
      phone: '1234567890',
      role: Role.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return user;
  }
}
