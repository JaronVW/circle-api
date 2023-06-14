import { Controller, Get } from '@nestjs/common';
import { NpmserverService } from './npmserver.service';

@Controller('npmserver')
export class NpmserverController {
  constructor(private readonly npmserverService: NpmserverService) {}

  @Get('live/streams')
  async getEndpoint(): Promise<any> {
    try {
      const data = await this.npmserverService.fetchData();
      return await this.npmserverService.getStreamersDataFeed(
        data.items.map((item) => item.name),
      );
    } catch (error) {
      console.error('Error fetching data: ', error);
<<<<<<< HEAD
      return { error: 'Failed to fetch data' }
=======
      return { errpr: 'Failed to fetch data' };
>>>>>>> 1a9a0d6a166ac2b639fe5a4a29579c077e181c70
    }
  }
}
