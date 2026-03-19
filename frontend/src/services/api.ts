import axios from 'axios';
import type { FormData } from '@dmv/shared';

export async function generatePdf(data: FormData): Promise<void> {
  const response = await axios.post('/api/form/generate-pdf', data, {
    responseType: 'blob',
  });

  const blob = new Blob([response.data], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'REG-156-filled.pdf';
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function extractApiErrors(error: unknown): string[] {
  if (!axios.isAxiosError(error)) return ['An unexpected error occurred'];

  const data = error.response?.data;

  if (data instanceof Blob) {
    return ['Server returned an error. Please try again.'];
  }

  if (data?.message) {
    return Array.isArray(data.message) ? data.message : [data.message];
  }

  return ['Failed to generate PDF. Please check your input and try again.'];
}
