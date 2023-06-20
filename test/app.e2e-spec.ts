import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma.service';
import { useContainer } from 'class-validator';
import * as bcrypt from 'bcrypt';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const password = '123456';

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
          Password: bcrypt.hashSync(password, 10),
          SSN: '123456789',
          PhoneNumber: '123456789',
          Address: '123456789',
          PostalCode: '1234aa',
          Birthdate: new Date(),
          Country: 'Netherlands',
          // Stream:
        },
        {
          Email: 'mail2@mail.com',
          FirstName: 'Jane',
          LastName: 'Doe',
          Password: bcrypt.hashSync(password, 10),
          SSN: '123456780',
          PhoneNumber: '123456780',
          Address: '123456780',
          PostalCode: '1234aa',
          Birthdate: new Date(),
          Country: 'Netherlands',
        },
        {
          Email: 'mail3@mail.com',
          FirstName: 'John',
          LastName: 'Smith',
          Password: bcrypt.hashSync(password, 10),
          SSN: '123456781',
          PhoneNumber: '123456781',
          Address: '123456781',
          PostalCode: '1234aa',
          Birthdate: new Date(),
          Country: 'Netherlands',
        },
        {
          Email: 'mail4@mail.com',
          FirstName: 'Jane',
          LastName: 'Smith',
          Password: bcrypt.hashSync(password, 10),
          SSN: '123456782',
          PhoneNumber: '123456782',
          Address: '123456782',
          PostalCode: '1234aa',
          Birthdate: new Date(),
          Country: 'Netherlands',
        },
      ],
    });

    await prisma.streamerIdentifier.createMany({
      data: [],
    });
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
