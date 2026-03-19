import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { GlobalExceptionFilter } from '../common/http-exception.filter';

describe('FormController (integration)', () => {
  let app: INestApplication;

  const validPayload = {
    vehicleInfo: { licensePlate: '7ABC123', make: 'Toyota', vin: '1HGBH41JXMN109186' },
    ownerInfo: {
      fullName: 'Doe, John',
      physicalAddress: { street: '123 Main', city: 'LA', state: 'CA', zip: '90001' },
    },
    itemsRequested: { licensePlates: true },
    reason: { type: 'lost' },
    certification: { name: 'John Doe', phone: '5551234567', date: '01/01/2026' },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    app.useGlobalFilters(new GlobalExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/form/generate-pdf — returns PDF with valid data', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/form/generate-pdf')
      .send(validPayload)
      .expect(201);

    expect(res.headers['content-type']).toContain('application/pdf');
    expect(res.headers['content-disposition']).toContain('REG-156-filled.pdf');
    expect(res.body.length).toBeGreaterThan(1000);
  });

  it('POST /api/form/generate-pdf — returns 400 with empty body', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/form/generate-pdf')
      .send({})
      .expect(400);

    expect(res.body.message).toBeDefined();
    expect(res.body.message.length).toBeGreaterThan(0);
  });

  it('POST /api/form/generate-pdf — returns 400 with invalid VIN', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/form/generate-pdf')
      .send({ ...validPayload, vehicleInfo: { ...validPayload.vehicleInfo, vin: 'TOOSHORT' } })
      .expect(400);

    expect(res.body.message).toBeDefined();
  });

  it('POST /api/form/generate-pdf — returns 400 with invalid ZIP', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/form/generate-pdf')
      .send({
        ...validPayload,
        ownerInfo: {
          ...validPayload.ownerInfo,
          physicalAddress: { ...validPayload.ownerInfo.physicalAddress, zip: 'BADZIP' },
        },
      })
      .expect(400);

    expect(res.body.message).toBeDefined();
  });

  it('POST /api/form/generate-pdf — accepts empty optional strings', async () => {
    const payload = {
      ...validPayload,
      vehicleInfo: { ...validPayload.vehicleInfo, dpPlacardNumber: '', birthDate: '', engineNumber: '' },
      certification: { ...validPayload.certification, email: '', title: '' },
    };

    await request(app.getHttpServer())
      .post('/api/form/generate-pdf')
      .send(payload)
      .expect(201);
  });

  it('POST /api/form/generate-pdf — rejects unknown fields', async () => {
    await request(app.getHttpServer())
      .post('/api/form/generate-pdf')
      .send({ ...validPayload, hackField: 'malicious' })
      .expect(400);
  });
});
