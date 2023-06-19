import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma.service';
import { useContainer } from 'class-validator';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  beforeAll(async () => {
    await prisma.user.createMany({
      data: [
        {
          Email: 'mail@mail.com',
          FirstName: 'John',
          LastName: 'Doe',
          Password: '123456',
          SSN: '123456789',
          PhoneNumber: '123456789',
          Address: '123456789',
          PostalCode: '1234aa',
          Birthdate: new Date(),
          Country: 'Netherlands',
          // Stream:
        },
      ],
    });
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
