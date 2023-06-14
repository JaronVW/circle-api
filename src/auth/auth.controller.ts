import { Controller, Get, Request, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { LogsService } from 'src/logstable/logs.service';
import { DateTime } from 'luxon';

@Controller()
export class AuthController {
  constructor(private authService: AuthService, private logService: LogsService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req: any) {
    const userId = req.user.UserID;
    this.logService.createLog({
      UserID: userId,
      LogText: "User " + userId + " logged in on " + new Date().toLocaleString()
    });
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    const userId = req.user.UserID
    this.logService.createLog({
      UserID: userId,
      LogText: "User " + userId + " requested profile on " + new Date().toLocaleString()
    });
    return req.user;
  }
}
