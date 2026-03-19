import { mapFormDataToPdfFields } from './pdf-field-mapper';
import type { FormData } from '@dmv/shared';

function makeFormData(overrides: Partial<FormData> = {}): FormData {
  return {
    vehicleInfo: {
      licensePlate: '7ABC123',
      make: 'Toyota',
      vin: '1HGBH41JXMN109186',
    },
    ownerInfo: {
      fullName: 'Doe, John',
      physicalAddress: { street: '123 Main St', city: 'LA', state: 'CA', zip: '90001' },
    },
    itemsRequested: { licensePlates: true, registrationCard: true },
    reason: { type: 'lost' },
    certification: { name: 'John Doe', phone: '5551234567', date: '01/01/2026' },
    ...overrides,
  };
}

describe('mapFormDataToPdfFields', () => {
  it('maps vehicle info text fields', () => {
    const data = makeFormData({
      vehicleInfo: {
        licensePlate: 'ABC',
        make: 'Honda',
        vin: '12345678901234567',
        dpPlacardNumber: 'DP001',
        birthDate: '03/15/1990',
        engineNumber: 'ENG999',
      },
    });
    const { textFields } = mapFormDataToPdfFields(data);

    expect(textFields.vehicleLicensePlate).toBe('ABC');
    expect(textFields.vehicleMake).toBe('Honda');
    expect(textFields.vehicleVin).toBe('12345678901234567');
    expect(textFields.vehicleDpPlacardNumber).toBe('DP001');
    expect(textFields.vehicleBirthDate).toBe('03/15/1990');
    expect(textFields.vehicleEngineNumber).toBe('ENG999');
  });

  it('maps owner info and physical address', () => {
    const data = makeFormData({
      ownerInfo: {
        fullName: 'Smith, Jane',
        dlNumber: 'D1234567',
        coOwnerFullName: 'Smith, Bob',
        coOwnerDlNumber: 'D7654321',
        physicalAddress: { street: '456 Oak Ave', apt: '5B', city: 'SF', state: 'CA', zip: '94101' },
        county: 'San Francisco',
      },
    });
    const { textFields } = mapFormDataToPdfFields(data);

    expect(textFields.ownerFullName).toBe('Smith, Jane');
    expect(textFields.ownerDlNumber).toBe('D1234567');
    expect(textFields.coOwnerFullName).toBe('Smith, Bob');
    expect(textFields.coOwnerDlNumber).toBe('D7654321');
    expect(textFields.physicalStreet).toBe('456 Oak Ave');
    expect(textFields.physicalApt).toBe('5B');
    expect(textFields.physicalCity).toBe('SF');
    expect(textFields.physicalState).toBe('CA');
    expect(textFields.physicalZip).toBe('94101');
    expect(textFields.ownerCounty).toBe('San Francisco');
  });

  it('maps mailing address when provided', () => {
    const data = makeFormData({
      ownerInfo: {
        fullName: 'Test',
        physicalAddress: { street: 'A', city: 'B', state: 'CA', zip: '90001' },
        mailingAddress: { street: '789 Elm', apt: '3', city: 'LA', state: 'NY', zip: '10001' },
      },
    });
    const { textFields } = mapFormDataToPdfFields(data);

    expect(textFields.mailingStreet).toBe('789 Elm');
    expect(textFields.mailingApt).toBe('3');
    expect(textFields.mailingCity).toBe('LA');
    expect(textFields.mailingState).toBe('NY');
    expect(textFields.mailingZip).toBe('10001');
  });

  it('sets mailing fields to undefined when no mailing address', () => {
    const data = makeFormData();
    const { textFields } = mapFormDataToPdfFields(data);

    expect(textFields.mailingStreet).toBeUndefined();
    expect(textFields.mailingCity).toBeUndefined();
  });

  it('maps certification fields', () => {
    const data = makeFormData({
      certification: {
        name: 'Jane Smith',
        title: 'Manager',
        phone: '5559876543',
        date: '12/25/2025',
        email: 'jane@example.com',
      },
    });
    const { textFields } = mapFormDataToPdfFields(data);

    expect(textFields.certName).toBe('Jane Smith');
    expect(textFields.certTitle).toBe('Manager');
    expect(textFields.certPhone).toBe('5559876543');
    expect(textFields.certDate).toBe('12/25/2025');
    expect(textFields.certEmail).toBe('jane@example.com');
  });

  it('maps items requested checkboxes', () => {
    const data = makeFormData({
      itemsRequested: { licensePlates: true, yearSticker: true, pnoCard: false },
    });
    const { checkboxFields } = mapFormDataToPdfFields(data);

    expect(checkboxFields.itemLicensePlates).toBe(true);
    expect(checkboxFields.itemYearSticker).toBe(true);
    expect(checkboxFields.itemPnoCard).toBe(false);
    expect(checkboxFields.itemRegistrationCard).toBeUndefined();
  });

  it('sets the correct reason checkbox for each reason type', () => {
    const types = [
      ['lost', 'reasonLost'],
      ['stolen', 'reasonStolen'],
      ['destroyed', 'reasonDestroyed'],
      ['notReceivedDmv', 'reasonNotReceivedDmv'],
      ['notReceivedOwner', 'reasonNotReceivedOwner'],
      ['surrendered', 'reasonSurrendered'],
      ['specialPlatesRetained', 'reasonSpecialPlatesRetained'],
      ['regCardCurrentAddr', 'reasonRegCardCurrentAddr'],
      ['perCvc', 'reasonPerCvc'],
      ['other', 'reasonOther'],
    ] as const;

    for (const [type, expectedField] of types) {
      const data = makeFormData({ reason: { type } });
      const { checkboxFields } = mapFormDataToPdfFields(data);
      expect(checkboxFields[expectedField]).toBe(true);
    }
  });

  it('maps surrendered count checkboxes', () => {
    const one = makeFormData({ reason: { type: 'surrendered', surrenderedCount: 'one' } });
    expect(mapFormDataToPdfFields(one).checkboxFields.surrenderedOne).toBe(true);
    expect(mapFormDataToPdfFields(one).checkboxFields.surrenderedTwo).toBe(false);

    const two = makeFormData({ reason: { type: 'surrendered', surrenderedCount: 'two' } });
    expect(mapFormDataToPdfFields(two).checkboxFields.surrenderedOne).toBe(false);
    expect(mapFormDataToPdfFields(two).checkboxFields.surrenderedTwo).toBe(true);
  });

  it('does not set surrendered checkboxes for non-surrendered reasons', () => {
    const data = makeFormData({ reason: { type: 'lost' } });
    const { checkboxFields } = mapFormDataToPdfFields(data);

    expect(checkboxFields.surrenderedOne).toBeUndefined();
    expect(checkboxFields.surrenderedTwo).toBeUndefined();
  });

  it('maps reason explanation text', () => {
    const data = makeFormData({ reason: { type: 'other', explanation: 'Custom reason' } });
    const { textFields } = mapFormDataToPdfFields(data);
    expect(textFields.reasonExplanation).toBe('Custom reason');
  });
});
