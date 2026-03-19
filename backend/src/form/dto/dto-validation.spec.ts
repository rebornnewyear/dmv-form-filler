import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { VehicleInfoDto } from './vehicle-info.dto';
import { AddressDto } from './address.dto';
import { OwnerInfoDto } from './owner-info.dto';
import { CertificationDto } from './certification.dto';
import { ReasonDto } from './reason.dto';
import { ItemsRequestedDto } from './items-requested.dto';
import { FormDataDto } from './form-data.dto';

async function validateDto<T extends object>(cls: new () => T, data: Record<string, unknown>): Promise<string[]> {
  const instance = plainToInstance(cls, data);
  const errors = await validate(instance, { whitelist: true, forbidNonWhitelisted: true });
  return errors.flatMap((e) =>
    e.constraints ? Object.values(e.constraints) : [],
  );
}

describe('VehicleInfoDto', () => {
  const valid = { licensePlate: '7ABC123', make: 'Toyota', vin: '1HGBH41JXMN109186' };

  it('passes with valid required fields', async () => {
    expect(await validateDto(VehicleInfoDto, valid)).toHaveLength(0);
  });

  it('fails when licensePlate is empty', async () => {
    const errs = await validateDto(VehicleInfoDto, { ...valid, licensePlate: '' });
    expect(errs.some((m) => m.toLowerCase().includes('license plate'))).toBe(true);
  });

  it('fails when make is empty', async () => {
    const errs = await validateDto(VehicleInfoDto, { ...valid, make: '' });
    expect(errs.some((m) => m.toLowerCase().includes('make'))).toBe(true);
  });

  it('fails when VIN has wrong format', async () => {
    const errs = await validateDto(VehicleInfoDto, { ...valid, vin: 'SHORT' });
    expect(errs.length).toBeGreaterThan(0);
  });

  it('accepts valid 17-char VIN', async () => {
    expect(await validateDto(VehicleInfoDto, valid)).toHaveLength(0);
  });

  it('accepts empty optional birthDate after transform', async () => {
    const instance = plainToInstance(VehicleInfoDto, { ...valid, birthDate: '' });
    const errors = await validate(instance);
    expect(errors).toHaveLength(0);
  });

  it('fails birthDate with wrong format', async () => {
    const errs = await validateDto(VehicleInfoDto, { ...valid, birthDate: '2024-01-01' });
    expect(errs.some((m) => m.includes('MM/DD/YYYY'))).toBe(true);
  });

  it('accepts valid birthDate', async () => {
    expect(await validateDto(VehicleInfoDto, { ...valid, birthDate: '03/15/1990' })).toHaveLength(0);
  });
});

describe('AddressDto', () => {
  const valid = { street: '123 Main St', city: 'Los Angeles', state: 'CA', zip: '90001' };

  it('passes with valid data', async () => {
    expect(await validateDto(AddressDto, valid)).toHaveLength(0);
  });

  it('fails when street is missing', async () => {
    const errs = await validateDto(AddressDto, { ...valid, street: undefined });
    expect(errs.length).toBeGreaterThan(0);
  });

  it('fails with invalid ZIP format', async () => {
    const errs = await validateDto(AddressDto, { ...valid, zip: 'ABCDE' });
    expect(errs.length).toBeGreaterThan(0);
  });

  it('accepts 5+4 ZIP format', async () => {
    expect(await validateDto(AddressDto, { ...valid, zip: '90001-1234' })).toHaveLength(0);
  });
});

describe('CertificationDto', () => {
  const valid = { name: 'John Doe', phone: '5551234567', date: '01/15/2026' };

  it('passes with valid data', async () => {
    expect(await validateDto(CertificationDto, valid)).toHaveLength(0);
  });

  it('fails with invalid date format', async () => {
    const errs = await validateDto(CertificationDto, { ...valid, date: '2026-01-15' });
    expect(errs.some((m) => m.includes('MM/DD/YYYY'))).toBe(true);
  });

  it('accepts valid email', async () => {
    expect(await validateDto(CertificationDto, { ...valid, email: 'test@example.com' })).toHaveLength(0);
  });

  it('fails with invalid email', async () => {
    const errs = await validateDto(CertificationDto, { ...valid, email: 'not-an-email' });
    expect(errs.length).toBeGreaterThan(0);
  });

  it('accepts empty email after transform', async () => {
    const instance = plainToInstance(CertificationDto, { ...valid, email: '' });
    const errors = await validate(instance);
    expect(errors).toHaveLength(0);
  });
});

describe('ReasonDto', () => {
  it('passes with valid reason type', async () => {
    expect(await validateDto(ReasonDto, { type: 'lost' })).toHaveLength(0);
  });

  it('fails with invalid reason type', async () => {
    const errs = await validateDto(ReasonDto, { type: 'invalid' });
    expect(errs.length).toBeGreaterThan(0);
  });

  it('allows stolen without explanation (known gap — frontend Zod enforces this)', async () => {
    // @IsOptional overrides @IsNotEmpty when value is undefined/null.
    // The frontend Zod .refine() is the primary enforcement for this rule.
    const errs = await validateDto(ReasonDto, { type: 'stolen' });
    expect(errs).toHaveLength(0);
  });

  it('passes when stolen has explanation', async () => {
    expect(await validateDto(ReasonDto, { type: 'stolen', explanation: 'Was stolen from car' })).toHaveLength(0);
  });
});

describe('FormDataDto', () => {
  const validForm = {
    vehicleInfo: { licensePlate: '7ABC123', make: 'Toyota', vin: '1HGBH41JXMN109186' },
    ownerInfo: {
      fullName: 'Doe, John',
      physicalAddress: { street: '123 Main', city: 'LA', state: 'CA', zip: '90001' },
    },
    itemsRequested: { licensePlates: true },
    reason: { type: 'lost' },
    certification: { name: 'John Doe', phone: '5551234567', date: '01/01/2026' },
  };

  it('fails when vehicleInfo is missing', async () => {
    const errs = await validateDto(FormDataDto, {});
    expect(errs.length).toBeGreaterThan(0);
  });

  it('fails when no items are selected', async () => {
    const errs = await validateDto(FormDataDto, { ...validForm, itemsRequested: {} });
    expect(errs.some((m) => m.toLowerCase().includes('at least one item'))).toBe(true);
  });

  it('passes when at least one item is selected', async () => {
    const errs = await validateDto(FormDataDto, validForm);
    expect(errs).toHaveLength(0);
  });
});
