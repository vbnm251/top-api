import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { disconnect } from 'mongoose';
import { USER_NOT_FOUND, WRONG_PASSWORD } from '../src/auth/auth.constants';

const loginDto: AuthDto = {
  login: 'example@example.com',
  password: '123',
};

describe('AuthTest (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('auth/login (POST) -success', (done) => {
    request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.acces_token).toBeDefined();
        done();
      });
  });

  it('auth/login (POST) -fail', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, password: '12' })
      .expect(401, {
        message: WRONG_PASSWORD,
        error: 'Unauthorized',
        statusCode: 401,
      });
  });

  it('auth/login (POST) -fail', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, login: 'b@b.com' })
      .expect(401, {
        message: USER_NOT_FOUND,
        error: 'Unauthorized',
        statusCode: 401,
      });
  });

  afterAll(() => {
    disconnect();
  });
});
