import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserModel } from 'src/auth/user.model';

export const UserEmail = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
