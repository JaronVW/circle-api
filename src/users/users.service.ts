import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private service: PrismaService) {}

  async findOne(username: string): Promise<any> {
    return await this.service.user.findFirst({
      where: {
        Email: username,
      },
      include: {
        Stream: {
          select: {
            StreamID: true,
          },
        },
      },
    });
  }
}
