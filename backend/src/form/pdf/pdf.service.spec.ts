import { PdfService } from './pdf.service';
import { PDFDocument } from 'pdf-lib';
import type { FormData } from '@dmv/shared';

function makeFormData(): FormData {
  return {
    vehicleInfo: { licensePlate: '7ABC123', make: 'Toyota', vin: '1HGBH41JXMN109186' },
    ownerInfo: {
      fullName: 'Doe, John',
      physicalAddress: { street: '123 Main', city: 'LA', state: 'CA', zip: '90001' },
    },
    itemsRequested: { licensePlates: true },
    reason: { type: 'lost' },
    certification: { name: 'John Doe', phone: '5551234567', date: '01/01/2026' },
  };
}

describe('PdfService', () => {
  let service: PdfService;

  beforeAll(() => {
    service = new PdfService();
    service.onModuleInit();
  });

  it('loads template on init without throwing', () => {
    expect(() => service.onModuleInit()).not.toThrow();
  });

  it('generates a valid PDF (non-empty Uint8Array)', async () => {
    const result = await service.generatePdf(makeFormData());
    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBeGreaterThan(1000);
  });

  it('generated PDF is valid and parseable', async () => {
    const result = await service.generatePdf(makeFormData());
    const doc = await PDFDocument.load(result);
    expect(doc.getPageCount()).toBe(1);
  });

  it('fills text fields correctly', async () => {
    const data = makeFormData();
    data.vehicleInfo.licensePlate = 'TEST999';
    data.certification.email = 'test@test.com';

    const result = await service.generatePdf(data);
    const doc = await PDFDocument.load(result);
    const form = doc.getForm();

    expect(form.getTextField('vehicleLicensePlate').getText()).toBe('TEST999');
    expect(form.getTextField('certEmail').getText()).toBe('test@test.com');
  });

  it('checks the correct checkbox for reason', async () => {
    const data = makeFormData();
    data.reason.type = 'stolen';
    data.reason.explanation = 'Stolen from car';

    const result = await service.generatePdf(data);
    const doc = await PDFDocument.load(result);
    const form = doc.getForm();

    expect(form.getCheckBox('reasonStolen').isChecked()).toBe(true);
    expect(form.getCheckBox('reasonLost').isChecked()).toBe(false);
  });

  it('handles items requested checkboxes', async () => {
    const data = makeFormData();
    data.itemsRequested = { licensePlates: true, registrationCard: true, yearSticker: false };

    const result = await service.generatePdf(data);
    const doc = await PDFDocument.load(result);
    const form = doc.getForm();

    expect(form.getCheckBox('itemLicensePlates').isChecked()).toBe(true);
    expect(form.getCheckBox('itemRegistrationCard').isChecked()).toBe(true);
  });

  it('handles surrendered count', async () => {
    const data = makeFormData();
    data.reason = { type: 'surrendered', surrenderedCount: 'two' };

    const result = await service.generatePdf(data);
    const doc = await PDFDocument.load(result);
    const form = doc.getForm();

    expect(form.getCheckBox('reasonSurrendered').isChecked()).toBe(true);
    expect(form.getCheckBox('surrenderedTwo').isChecked()).toBe(true);
    expect(form.getCheckBox('surrenderedOne').isChecked()).toBe(false);
  });

  it('handles optional fields gracefully (no crash on undefined)', async () => {
    const data = makeFormData();
    data.vehicleInfo.dpPlacardNumber = undefined;
    data.ownerInfo.mailingAddress = undefined;
    data.certification.email = undefined;

    const result = await service.generatePdf(data);
    expect(result.length).toBeGreaterThan(1000);
  });
});
