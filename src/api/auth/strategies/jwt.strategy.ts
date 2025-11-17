import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Admin } from 'src/schemas/admin.schema';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/auth/interfaces/user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectModel('Admin') private readonly adminModel: Model<Admin>,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET')!,
    });
  }

  async validate(payload: any): Promise<User> {
    const user = (await this.adminModel.findById(payload.sub)) as Admin & {
      _id: any;
    };
    if (!user) {
      throw new UnauthorizedException('User not found in admin database!');
    }
    return {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}