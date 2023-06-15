import { Controller, Body, Get, Put, Param } from '@nestjs/common';
import { SatoshiService } from './satoshi.service';
import { PrismaService } from 'src/prisma.service';
import { DoublingService } from './doubling.service';

@Controller('satoshi')
export class SatoshiController {
  constructor(private readonly satoshiService: SatoshiService, private readonly prismaService: PrismaService,
    private readonly doublingService: DoublingService) {}

  @Put(':id')
  async createAddMoney(@Param('id') id: number, @Body() data: any): Promise<any> {
    const account = await this.getAmountMoney(id);
    var start = Number(account.Amount);
    const hours = data.Amount;
    const newAmount = this.doublingService.doubleNumberNTimes(start, hours);
    //amount in the api call will be the amount of hours streamed

    const updatedData = await this.prismaService.satoshi.update({
      where: {
        SatoshiAccountID: Number(id),
      },
      data: {
        Amount: newAmount,
        UserID: data.UserID
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
