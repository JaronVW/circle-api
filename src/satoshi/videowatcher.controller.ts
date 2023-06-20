import * as chokidar from 'chokidar';
import * as ffmpeg from 'fluent-ffmpeg';
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);
import axios from 'axios';

export class VideoWatcher {
  constructor(private readonly folderPath: string, private readonly apiUrl: string) {}

  startWatching(): void {
    const watcher = chokidar.watch(this.folderPath, {
      ignoreInitial: true, // Ignore initial file scan
    });

    watcher.on('add', (videoPath) => {
      this.processVideo(videoPath)
        .then((duration) => this.sendVideoDuration(videoPath, duration))
        .catch((error) => console.error('Error processing video:', error));
    });
  }

  private processVideo(videoPath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(videoPath, (err, metadata) => {
        if (err) {
          reject(err);
        } else {
          const duration = metadata.format.duration;
          resolve(parseFloat(duration));
        }
      });
    });
  }

  private sendVideoDuration(videoPath: string, duration: number): void {
    const filename = this.getFilenameFromPath(videoPath);
    const satoshiId = axios.get('http://localhost:3000/satoshi/stream/' + filename);
    axios
      .post(this.apiUrl + satoshiId + '/' + duration, { filename, duration })
      .then(() => console.log(`Video duration for ${filename} sent to the API.`))
      .catch((error) => console.error('Error sending video duration to API:', error));
  }

  private getFilenameFromPath(videoPath: string): string {
    const pathParts = videoPath.split('/');
    return pathParts[pathParts.length - 1];
  }
}