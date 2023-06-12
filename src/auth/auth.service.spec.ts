/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User, UsersService } from 'src/users/users.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import bcrypt = require('bcrypt');
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, JwtService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);

    usersService.findOne = jest.fn().mockResolvedValue({
      id: 1,
      FirstName: 'John',
      LastName: 'Joe',
      Email: 'johndoe@email.com',
      Password: 'password123',
      SSN: '1234567890',
      PhoneNumber: '0612345678',
      Address: 'Teststraat 1',
      PostalCode: '1234AB',
      BirthDate: '2000-01-15',
    });
    jwtService.sign = jest.fn().mockResolvedValue('mocked_token');
  });

  // goede inlogggegevens -> krijgt token
  it('should return an access token on successful login', async () => {
    const result = await service.login({
      Email: 'testuser@example.com',
      UserID: 1,
    });

    expect(result).toEqual({ access_token: 'mocked_token' });
    expect(usersService.findOne).toHaveBeenCalledWith('testuser@example.com');
    expect(jwtService.sign).toHaveBeenCalledWith({
      username: 'testuser@example.com',
      sub: 1,
    });
  });

  // slechte inloggegevens -> geen token
  it('should return null on invalid login', async () => {
    usersService.findOne = jest.fn().mockResolvedValue(null);

    const result = await service.login({
      Email: 'testuser@example.com',
      UserID: 1,
    });

    expect(result).toBeNull();
    expect(usersService.findOne).toHaveBeenCalledWith('testuser@example.com');
    expect(jwtService.sign).not.toHaveBeenCalled();
  });

  // randgeval: voor wanneer een gebruiker geen wachtwoord heeft
  it('should exclude password field from the returned user object', async () => {
    const result = await service.validateUser(
      'testuser@example.com',
      'password',
    );

    expect(result).toEqual({
      Email: 'testuser@example.com',
      UserID: 1,
    });
    expect(usersService.findOne).toHaveBeenCalledWith('testuser@example.com');
  });
});
