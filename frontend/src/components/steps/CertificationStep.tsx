import { TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useFormContext } from 'react-hook-form';
import type { FormDataValues } from '../../validation/schemas';

export default function CertificationStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormDataValues>();

  const e = errors.certification;

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Section 5 — Certification
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        I certify under penalty of perjury that the statements on this application
        are true and correct.
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Print Name"
            {...register('certification.name')}
            error={!!e?.name}
            helperText={e?.name?.message}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Title"
            {...register('certification.title')}
            error={!!e?.title}
            helperText={e?.title?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Daytime Phone Number"
            {...register('certification.phone')}
            error={!!e?.phone}
            helperText={e?.phone?.message}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Date"
            placeholder="MM/DD/YYYY"
            {...register('certification.date')}
            error={!!e?.date}
            helperText={e?.date?.message}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Email Address"
            {...register('certification.email')}
            error={!!e?.email}
            helperText={e?.email?.message}
          />
        </Grid>
      </Grid>
    </>
  );
}
