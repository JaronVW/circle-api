import { Controller, Get } from '@nestjs/common';
import { NpmserverService } from './npmserver.service';

@Controller('npmserver')
export class NpmserverController {
  constructor(private readonly npmserverService: NpmserverService) { }

  @Get('live/streams')
  async getEndpoint(): Promise<any> {
    try {
      const data = await this.npmserverService.fetchData();
      return await this.npmserverService.getStreamersDataFeed(
        data.items.map((item) => item.name),
      );
    } catch (error) {
      console.error('Error fetching data: ', error);
      return { error: 'Failed to fetch data' }
    }
  }
}
