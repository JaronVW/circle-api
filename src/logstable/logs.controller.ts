import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LogsService } from './logs.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PrismaService } from 'src/prisma.service';

@Controller('logs')
export class LogsController {
  constructor(
    private readonly logsService: LogsService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post('log')
  @UseGuards(JwtAuthGuard)
  async createLog(@Body() data: any): Promise<any> {
    if (data.UserID && data.LogText) {
      return this.prismaService.$transaction(async (prisma) => {
        return prisma.log.create({ data });
      });
    }
    return new Error('The log was of the wrong type!');
  }

  @Get('stream/start/:userID')
  @UseGuards(JwtAuthGuard)
  async createStreamStartLog(
    @Param('userID') userID,
    @Req() req,
  ): Promise<any> {
    const date = new Date();
    const data = {
      UserID: Number(userID),
      LogText:
        'User ' +
        req.user.UserID +
        ' started streaming on ' +
        date.toLocaleString(),
      DateTime: date,
    };

    const log = await this.prismaService.$transaction(async (prisma) => {
      return prisma.log.create({ data });
    });

    console.log('log' + log.LogID);

    return log.LogID;
  }

  @Post('stream/stop/:userID/:logID')
  @UseGuards(JwtAuthGuard)
  async createStreamStopLog(
    @Param('userID') userID,
    @Param('logID') logID,
    @Req() req,
  ): Promise<any> {
    const date = new Date();
    const data = {
      UserID: Number(userID),
      LogText:
        'User ' +
        req.user.UserID +
        ' stopped streaming on ' +
        date.toLocaleString(),
      DateTime: date,
    };

    this.prismaService.$transaction(async (prisma) => {
      return prisma.log.create({ data });
    });

    const startLog = await this.prismaService.log.findFirst({
      where: { LogID: req.params.logID },
    });

    const time = date.getTime() - startLog.DateTime.getTime();
    console.log(time);

    const satoshi = await this.prismaService.satoshi.findFirst({
      where: { UserID: userID },
    });

    return this.prismaService.$transaction(async (prisma) => {
      const amount = 2 ** (time / 3600000);
      const logText =
        'User ' +
        userID +
        ' updated Satoshi amount to ' +
        amount +
        ' on ' +
        new Date().toLocaleString();

      this.prismaService.$transaction(async (prisma) => {
        return prisma.log.create({
          data: { UserID: userID, LogText: logText },
        });
      });
      const updatedData = await this.prismaService.satoshi.update({
        where: {
          SatoshiAccountID: Number(satoshi.SatoshiAccountID),
        },
        data: {
          Amount: amount,
        },
      });
      return updatedData;
    });
  }
}
