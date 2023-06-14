/* eslint-disable prettier/prettier */
import { CanActivate, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import * as fs from 'fs';
import * as CircularJSON from 'circular-json';

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
          .validatewsToken(
            context.args[0].handshake.headers.authorization.split(' ')[1],
          )
          .then((user) => {
            if (user) {
              resolve(user);
            } else {
              reject(false);
            }
          });
      });
    } catch (ex) {
      return false;
    }
  }
}
