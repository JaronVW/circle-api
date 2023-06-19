import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma.service';

const users: User[] = [
  {
    UserID: 1,
    Email: 'user@mail.com',
    Password: 'password',
    Infix: '',
    FirstName: 'John',
    LastName: 'Doe',
    SSN: '123456789',
    PhoneNumber: '123456789',
    Address: '1234 Main St',
    PostalCode: '12345',
    Birthdate: new Date('1990-01-01'),
    Country: 'Netherlands',
  },
  {
    UserID: 2,
    Email: 'user2@mail.com',
    Password: 'password',
    Infix: '',
    FirstName: 'Jane',
    LastName: 'Doe',
    SSN: '123456780',
    PhoneNumber: '123456780',
    Address: '1234 Main St',
    PostalCode: '12345',
    Birthdate: new Date('1990-01-01'),
    Country: 'Netherlands',
  },
];

const db = {
  user: {
    findFirst: jest.fn((args) => {
      return users.find((user) => user.Email === args.where.Email);
    }),
  },
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const user = await service.findOne(users[0].Email);
      expect(user).toEqual(users[0]);
    });

    it('should return undefined', async () => {
      const user = await service.findOne('fake_username');
      expect(user).toBeUndefined();
    });
  });
});
