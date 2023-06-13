/* eslint-disable prettier/prettier */
import { CanActivate, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { resolve } from 'path';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(
    context: any,
  ): Promise<
    boolean | any | Promise<boolean | any> | Observable<boolean | any>
  > {
    try {
      return new Promise((resolve, reject) => {
        return this.authService
          .validatewsToken(context.args[0].handshake.headers.authorization)
          .then((user) => {
            if (user) {
              console.log(user);
              resolve(user);
            } else {
              reject(false);
            }
          });
      });
    } catch (ex) {
      console.log(ex);
      return false;
    }
  }
}
