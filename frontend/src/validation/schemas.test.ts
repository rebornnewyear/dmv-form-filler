import { describe, it, expect } from 'vitest';
import {
  vehicleInfoSchema,
  ownerInfoSchema,
  itemsRequestedSchema,
  reasonSchema,
  certificationSchema,
  formDataSchema,
} from './schemas';

describe('vehicleInfoSchema', () => {
  const valid = { licensePlate: '7ABC123', make: 'Toyota', vin: '1HGBH41JXMN109186' };

  it('accepts valid data', () => {
    expect(vehicleInfoSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects empty licensePlate', () => {
    expect(vehicleInfoSchema.safeParse({ ...valid, licensePlate: '' }).success).toBe(false);
  });

  it('rejects empty make', () => {
    expect(vehicleInfoSchema.safeParse({ ...valid, make: '' }).success).toBe(false);
  });

  it('rejects invalid VIN (too short)', () => {
    expect(vehicleInfoSchema.safeParse({ ...valid, vin: 'SHORT' }).success).toBe(false);
  });

  it('rejects VIN with I, O, Q characters', () => {
    expect(vehicleInfoSchema.safeParse({ ...valid, vin: '1HGBH41IXMN109186' }).success).toBe(false);
    expect(vehicleInfoSchema.safeParse({ ...valid, vin: '1HGBH41OXMN109186' }).success).toBe(false);
    expect(vehicleInfoSchema.safeParse({ ...valid, vin: '1HGBH41QXMN109186' }).success).toBe(false);
  });

  it('accepts empty optional fields', () => {
    expect(vehicleInfoSchema.safeParse({ ...valid, birthDate: '', engineNumber: '' }).success).toBe(true);
  });

  it('accepts valid birthDate format', () => {
    expect(vehicleInfoSchema.safeParse({ ...valid, birthDate: '03/15/1990' }).success).toBe(true);
  });

  it('rejects invalid birthDate format', () => {
    expect(vehicleInfoSchema.safeParse({ ...valid, birthDate: '2024-01-01' }).success).toBe(false);
  });
});

describe('ownerInfoSchema', () => {
  const validAddr = { street: '123 Main', city: 'LA', state: 'CA', zip: '90001' };
  const valid = { fullName: 'Doe, John', physicalAddress: validAddr };

  it('accepts valid data', () => {
    expect(ownerInfoSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects empty fullName', () => {
    expect(ownerInfoSchema.safeParse({ ...valid, fullName: '' }).success).toBe(false);
  });

  it('rejects missing physicalAddress', () => {
    expect(ownerInfoSchema.safeParse({ fullName: 'Test' }).success).toBe(false);
  });

  it('rejects invalid ZIP in address', () => {
    const bad = { ...valid, physicalAddress: { ...validAddr, zip: 'ABCDE' } };
    expect(ownerInfoSchema.safeParse(bad).success).toBe(false);
  });

  it('accepts 5+4 ZIP format', () => {
    const good = { ...valid, physicalAddress: { ...validAddr, zip: '90001-1234' } };
    expect(ownerInfoSchema.safeParse(good).success).toBe(true);
  });

  it('accepts optional mailingAddress', () => {
    const withMailing = { ...valid, mailingAddress: validAddr };
    expect(ownerInfoSchema.safeParse(withMailing).success).toBe(true);
  });
});

describe('itemsRequestedSchema', () => {
  it('accepts when at least one item is selected', () => {
    expect(itemsRequestedSchema.safeParse({ licensePlates: true }).success).toBe(true);
  });

  it('rejects when no items selected', () => {
    expect(itemsRequestedSchema.safeParse({}).success).toBe(false);
  });

  it('rejects when all items are false', () => {
    expect(itemsRequestedSchema.safeParse({ licensePlates: false, registrationCard: false }).success).toBe(false);
  });
});

describe('reasonSchema', () => {
  it('accepts valid reason type', () => {
    expect(reasonSchema.safeParse({ type: 'lost' }).success).toBe(true);
  });

  it('rejects invalid reason type', () => {
    expect(reasonSchema.safeParse({ type: 'invalid' }).success).toBe(false);
  });

  it('rejects missing reason type', () => {
    expect(reasonSchema.safeParse({}).success).toBe(false);
  });

  it('requires explanation when type is stolen', () => {
    expect(reasonSchema.safeParse({ type: 'stolen' }).success).toBe(false);
    expect(reasonSchema.safeParse({ type: 'stolen', explanation: '' }).success).toBe(false);
  });

  it('accepts stolen with explanation', () => {
    expect(reasonSchema.safeParse({ type: 'stolen', explanation: 'Was stolen' }).success).toBe(true);
  });

  it('requires explanation when type is other', () => {
    expect(reasonSchema.safeParse({ type: 'other' }).success).toBe(false);
  });

  it('accepts other with explanation', () => {
    expect(reasonSchema.safeParse({ type: 'other', explanation: 'Custom reason' }).success).toBe(true);
  });

  it('does not require explanation for lost', () => {
    expect(reasonSchema.safeParse({ type: 'lost' }).success).toBe(true);
  });

  it('accepts surrenderedCount for surrendered type', () => {
    expect(reasonSchema.safeParse({ type: 'surrendered', surrenderedCount: 'one' }).success).toBe(true);
    expect(reasonSchema.safeParse({ type: 'surrendered', surrenderedCount: 'two' }).success).toBe(true);
  });
});

describe('certificationSchema', () => {
  const valid = { name: 'John Doe', phone: '5551234567', date: '01/15/2026' };

  it('accepts valid data', () => {
    expect(certificationSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects empty name', () => {
    expect(certificationSchema.safeParse({ ...valid, name: '' }).success).toBe(false);
  });

  it('rejects empty phone', () => {
    expect(certificationSchema.safeParse({ ...valid, phone: '' }).success).toBe(false);
  });

  it('rejects invalid date format', () => {
    expect(certificationSchema.safeParse({ ...valid, date: '2026-01-15' }).success).toBe(false);
  });

  it('accepts valid email', () => {
    expect(certificationSchema.safeParse({ ...valid, email: 'test@test.com' }).success).toBe(true);
  });

  it('rejects invalid email', () => {
    expect(certificationSchema.safeParse({ ...valid, email: 'not-email' }).success).toBe(false);
  });

  it('accepts empty email', () => {
    expect(certificationSchema.safeParse({ ...valid, email: '' }).success).toBe(true);
  });
});

describe('formDataSchema (full form)', () => {
  const validForm = {
    vehicleInfo: { licensePlate: '7ABC123', make: 'Toyota', vin: '1HGBH41JXMN109186' },
    ownerInfo: {
      fullName: 'Doe, John',
      physicalAddress: { street: '123 Main', city: 'LA', state: 'CA', zip: '90001' },
    },
    itemsRequested: { licensePlates: true },
    reason: { type: 'lost' as const },
    certification: { name: 'John Doe', phone: '5551234567', date: '01/01/2026' },
  };

  it('accepts complete valid form', () => {
    expect(formDataSchema.safeParse(validForm).success).toBe(true);
  });

  it('rejects when any section is missing', () => {
    const { vehicleInfo, ...rest } = validForm;
    expect(formDataSchema.safeParse(rest).success).toBe(false);
  });
});
