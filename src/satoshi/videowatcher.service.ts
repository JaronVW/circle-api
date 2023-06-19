import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VideoWatcher } from './videowatcher.controller';

@Injectable()
export class VideoService {
  constructor(private readonly configService: ConfigService) {}

  startVideoWatcher(): void {
    const folderPath = '././mediamtx/video';
    const apiUrl = this.configService.get<string>('http://localhost:3000/satoshi/');

    const videoWatcher = new VideoWatcher(folderPath, apiUrl);
    videoWatcher.startWatching();
  }
}
