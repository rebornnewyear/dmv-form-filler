import { TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useFormContext, useWatch } from 'react-hook-form';
import type { FormDataValues } from '../../validation/schemas';

export default function VehicleInfoStep() {
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
  } = useFormContext<FormDataValues>();

  const e = errors.vehicleInfo;

  const handleVinBlur = () => {
    const vin = getValues('vehicleInfo.vin');
    if (vin && vin.length >= 5) {
      setValue('vehicleInfo.vin', vin.toUpperCase());
    }
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Vehicle Information
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="License Plate / CF Number"
            {...register('vehicleInfo.licensePlate')}
            error={!!e?.licensePlate}
            helperText={e?.licensePlate?.message}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Make"
            {...register('vehicleInfo.make')}
            error={!!e?.make}
            helperText={e?.make?.message}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Vehicle ID Number / Hull ID Number"
            {...register('vehicleInfo.vin', { onBlur: handleVinBlur })}
            error={!!e?.vin}
            helperText={e?.vin?.message}
            inputProps={{ maxLength: 17 }}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Disabled Person Placard Number"
            {...register('vehicleInfo.dpPlacardNumber')}
            error={!!e?.dpPlacardNumber}
            helperText={e?.dpPlacardNumber?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Birth Date, if DP Placard"
            placeholder="MM/DD/YYYY"
            {...register('vehicleInfo.birthDate')}
            error={!!e?.birthDate}
            helperText={e?.birthDate?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Engine Number (Motorcycles Only)"
            {...register('vehicleInfo.engineNumber')}
            error={!!e?.engineNumber}
            helperText={e?.engineNumber?.message}
          />
        </Grid>
      </Grid>
    </>
  );
}
