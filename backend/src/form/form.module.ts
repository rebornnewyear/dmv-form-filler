import { Module } from '@nestjs/common';
import { FormController } from './form.controller';
import { PdfService } from './pdf/pdf.service';

@Module({
  controllers: [FormController],
  providers: [PdfService],
})
export class FormModule {}
