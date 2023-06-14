import { Controller, Body, Get, Put, Param } from '@nestjs/common';
import { SatoshiService } from './satoshi.service';
import { PrismaService } from 'src/prisma.service';

@Controller('satoshi')
export class SatoshiController {
  constructor(private readonly satoshiService: SatoshiService, private readonly prismaService: PrismaService) {}

  @Put(':id')
  async createAddMoney(@Param('id') id: number, @Body() data: any): Promise<any> {
    const updatedData = await this.prismaService.satoshi.update({
      where: {
        SatoshiAccountID: Number(id),
      },
      data: {
        ...data,
      },
    });
    return updatedData;
  }

  @Get('amount')
  async getAmountMoney(): Promise<any> {
    try {
      const data = await this.satoshiService.getAmountMoney();
    } catch (error) {
      console.error('Error fetching data: ', error);
      return { error: 'Failed to fetch data' }
    }
  }
}
