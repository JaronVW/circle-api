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

  // Of course in a real application, you wouldn't
  // store a password in plain text. You'd instead
  // use a library like bcrypt, with a salted
  // one-way hash algorithm. With that approach,
  // you'd only store hashed passwords, and then
  // compare the stored password to a hashed version
  // of the incoming password, thus never storing or
  // exposing user passwords in plain text.
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    console.log(user);
    const res = await bcrypt.compare(pass, user.Password);

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
      // check if user contains Stream object and add boolean to payload
      stream: user.Stream ? user.Stream.StreamID : false,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
