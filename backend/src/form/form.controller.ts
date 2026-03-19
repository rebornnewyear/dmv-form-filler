import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { FormDataDto } from './dto/form-data.dto';
import { PdfService } from './pdf/pdf.service';

@Controller('api/form')
export class FormController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('generate-pdf')
  async generatePdf(
    @Body() formData: FormDataDto,
    @Res() res: Response,
  ): Promise<void> {
    const pdfBytes = await this.pdfService.generatePdf(formData);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="REG-156-filled.pdf"',
      'Content-Length': pdfBytes.length,
    });
    res.end(Buffer.from(pdfBytes));
  }
}
