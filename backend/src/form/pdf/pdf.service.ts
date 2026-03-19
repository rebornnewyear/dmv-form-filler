import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PDFDocument } from 'pdf-lib';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { FormData } from '@dmv/shared';
import { mapFormDataToPdfFields } from './pdf-field-mapper';

@Injectable()
export class PdfService implements OnModuleInit {
  private readonly logger = new Logger(PdfService.name);
  private templateBytes!: Uint8Array;

  onModuleInit() {
    const templatePath = join(process.cwd(), 'templates', 'REG-156.pdf');
    this.templateBytes = readFileSync(templatePath);
    this.logger.log(`PDF template loaded (${this.templateBytes.length} bytes)`);
  }

  async generatePdf(data: FormData): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(this.templateBytes);
    const form = pdfDoc.getForm();

    const { textFields, checkboxFields } = mapFormDataToPdfFields(data);

    for (const [fieldName, value] of Object.entries(textFields)) {
      if (value == null) continue;
      try {
        const field = form.getTextField(fieldName);
        field.setText(value);
      } catch {
        this.logger.warn(`Text field "${fieldName}" not found in PDF template`);
      }
    }

    for (const [fieldName, checked] of Object.entries(checkboxFields)) {
      if (checked == null) continue;
      try {
        const field = form.getCheckBox(fieldName);
        if (checked) {
          field.check();
        } else {
          field.uncheck();
        }
      } catch {
        this.logger.warn(`Checkbox field "${fieldName}" not found in PDF template`);
      }
    }

    return pdfDoc.save();
  }
}
