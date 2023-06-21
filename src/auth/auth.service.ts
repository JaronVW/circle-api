import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (!user) return null;
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
      stream: user.Stream ? user.Stream.StreamerID : false,
      fullName: user.FirstName + ' ' + (user.Infix ? user.Infix + ' ' : '') + user.LastName
    };
    const token = this.jwtService.sign(payload);
    console.log(token);
    return {
      access_token: token,
    };
  }
}
