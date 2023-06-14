import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    console.log(user);
    const res = await bcrypt.compare(pass, user.Password);
    console.log(pass, user.Password);
    console.log(res);
    if (res) {
      const { Password, ...result } = user;
      return result;
    }
    return null;
  }

  async validatewsToken(token: string): Promise<any> {
    try {
      const user = await this.jwtService.verify(token);
      return user;
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }

  async login(user: any) {
    const payload = {
      username: user.Email,
      sub: user.UserID,
      stream: user.Stream ? user.Stream.StreamID : false,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
