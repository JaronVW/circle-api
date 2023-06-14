import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { parse, stringify } from 'flatted';
import * as fs from 'fs';

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    fs.writeFileSync('request.txt', stringify(request));
    return request.user;
  },
);
