import { Controller, Body, Get, Put, Param } from '@nestjs/common';
import { SatoshiService } from './satoshi.service';
import { PrismaService } from 'src/prisma.service';
import { DoublingService } from './doubling.service';
import { LogsService } from 'src/logstable/logs.service';

@Controller('satoshi')
export class SatoshiController {
  constructor(private readonly satoshiService: SatoshiService, private readonly prismaService: PrismaService,
    private readonly doublingService: DoublingService, private readonly logService: LogsService) {}

  @Get('stream/:streamid')
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
  async createAddMoney(@Param('id') id: number, @Param('amount') hours: number): Promise<any> {
    const account = await this.getAmountMoney(id);
    var start = Number(account.Amount);
    const newAmount = this.doublingService.doubleNumberNTimes(start, hours);
    const userID = this.prismaService.user.findFirst({
      where: { SatoshiID: Number(id) },
      select: { UserID: true },
    });
    //amount in the api call will be the amount of hours streamed

    this.logService.createLog({
      UserID: userID,
      LogText:
        'User ' +
        userID +
        ' updated satoshi amount to ' + newAmount + ' on ' +
        new Date().toLocaleString(),
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
  }

  @Get(':id')
  async getAmountMoney(@Param('id') id: number) {
    const resource = await this.prismaService.satoshi.findUnique({
      where: { SatoshiAccountID: Number(id) },
    });
    return resource;
  }
}
