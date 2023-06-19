import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  constructor(private service: PrismaService) {}

  async findOne(username: string): Promise<User | undefined> {
    return await this.service.user.findFirst({
      where: {
        Email: username,
      },
      include: {
        Stream: {
          select: {
            StreamerID: true,
          },
        },
      },
    });
  }
}
