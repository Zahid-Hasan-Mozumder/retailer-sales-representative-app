import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../interfaces';

export const GetUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request & { user: User }>();

    if (data) {
      return request.user?.[data] as string;
    }

    return request.user;
  },
);
