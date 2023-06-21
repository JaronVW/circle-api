import { Controller, Get, Put, Param, UseGuards } from '@nestjs/common';
import { SatoshiService } from './satoshi.service';
import { PrismaService } from 'src/prisma.service';
import { DoublingService } from './doubling.service';
import { LogsService } from 'src/logstable/logs.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('satoshi')
export class SatoshiController {
  constructor(
    private readonly satoshiService: SatoshiService,
    private readonly prismaService: PrismaService,
    private readonly doublingService: DoublingService,
    private readonly logService: LogsService,
  ) {}

  @Put(':id/:amount')
  @Get('stream/:streamid')
  @UseGuards(JwtAuthGuard)
  async getSatoshiIdByStreamId(@Param('streamid') id: string) {
    const user = await this.prismaService.user.findFirst({
      where: { StreamerID: id },
      select: { UserID: true },
    });
    if (!user) {
      return null;
    }
    const satoshi = await this.prismaService.satoshi.findFirst({
      where: { UserID: user.UserID },
      select: { SatoshiAccountID: true },
    });
    return satoshi;
  }

  @Put(':id/:amount')
  @UseGuards(JwtAuthGuard)
  async createAddMoney(
    @Param('id') id: number,
    @Param('amount') hours: number,
  ): Promise<any> {
    return this.prismaService.$transaction(async (prisma) => {
      const account = await this.getAmountMoney(id);
      if (!account) {
        throw new Error('No account with that ID!');
      }
      const start = Number(account.Amount);
      const newAmount = this.doublingService.doubleNumberNTimes(start, hours);
      const userID = account.UserID;
      const logText =
        'User ' +
        userID +
        ' updated Satoshi amount to ' +
        newAmount +
        ' on ' +
        new Date().toLocaleString();
      await this.logService.createLog({
        UserID: userID,
        LogText: logText,
      });
      const updatedData = await this.prismaService.satoshi.update({
        where: {
          SatoshiAccountID: Number(id),
        },
        data: {
          Amount: newAmount,
        },
      });
      return updatedData;
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getAmountMoney(@Param('id') id: number) {
    const resourceId = Number(id);
    if (isNaN(resourceId)) {
      throw new Error('Invalid ID provided');
    }
    const resource = await this.prismaService.satoshi.findUnique({
      where: { SatoshiAccountID: resourceId },
    });
    if (!resource) {
      throw new Error('Resource not found');
    }
    return resource;
  }
}
