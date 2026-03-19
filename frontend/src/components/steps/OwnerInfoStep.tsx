import { TextField, Typography, Divider, Switch, FormControlLabel, Autocomplete } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Controller, useFormContext } from 'react-hook-form';
import { useState } from 'react';
import type { FormDataValues } from '../../validation/schemas';
import { US_STATES } from '../../data/us-states';

export default function OwnerInfoStep() {
  const {
    register,
    control,
    formState: { errors },
    setValue,
  } = useFormContext<FormDataValues>();
  const [showMailing, setShowMailing] = useState(false);

  const e = errors.ownerInfo;

  const handleMailingToggle = (checked: boolean) => {
    setShowMailing(checked);
    if (!checked) {
      setValue('ownerInfo.mailingAddress', undefined);
    }
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Section 1 — Registered Owner of Record
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 8 }}>
          <TextField
            label="True Full Name (Last, First, Middle) or Business Name"
            {...register('ownerInfo.fullName')}
            error={!!e?.fullName}
            helperText={e?.fullName?.message}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Driver License / ID Card Number"
            {...register('ownerInfo.dlNumber')}
            error={!!e?.dlNumber}
            helperText={e?.dlNumber?.message}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 8 }}>
          <TextField
            label="Co-Owner True Full Name (Last, First, Middle)"
            {...register('ownerInfo.coOwnerFullName')}
            error={!!e?.coOwnerFullName}
            helperText={e?.coOwnerFullName?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Driver License / ID Card Number"
            {...register('ownerInfo.coOwnerDlNumber')}
            error={!!e?.coOwnerDlNumber}
            helperText={e?.coOwnerDlNumber?.message}
          />
        </Grid>

        <Grid size={12}>
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Physical Residence or Business Address
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Street Address"
            {...register('ownerInfo.physicalAddress.street')}
            error={!!e?.physicalAddress?.street}
            helperText={e?.physicalAddress?.street?.message}
            required
          />
        </Grid>
        <Grid size={{ xs: 4, sm: 1 }}>
          <TextField
            label="Apt"
            {...register('ownerInfo.physicalAddress.apt')}
            error={!!e?.physicalAddress?.apt}
            helperText={e?.physicalAddress?.apt?.message}
          />
        </Grid>
        <Grid size={{ xs: 8, sm: 3 }}>
          <TextField
            label="City"
            {...register('ownerInfo.physicalAddress.city')}
            error={!!e?.physicalAddress?.city}
            helperText={e?.physicalAddress?.city?.message}
            required
          />
        </Grid>
        <Grid size={{ xs: 4, sm: 2 }}>
          <Controller
            name="ownerInfo.physicalAddress.state"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={US_STATES}
                getOptionLabel={(opt) => typeof opt === 'string' ? opt : `${opt.code} — ${opt.name}`}
                value={US_STATES.find((s) => s.code === field.value) ?? null}
                onChange={(_, val) => field.onChange(val?.code ?? '')}
                isOptionEqualToValue={(opt, val) => opt.code === (typeof val === 'string' ? val : val.code)}
                size="small"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="State"
                    error={!!e?.physicalAddress?.state}
                    helperText={e?.physicalAddress?.state?.message}
                    required
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 8, sm: 2 }}>
          <TextField
            label="ZIP Code"
            {...register('ownerInfo.physicalAddress.zip')}
            error={!!e?.physicalAddress?.zip}
            helperText={e?.physicalAddress?.zip?.message}
            required
          />
        </Grid>

        <Grid size={12}>
          <TextField
            label="County of Residence or County Where Vehicle Is Garaged"
            {...register('ownerInfo.county')}
            error={!!e?.county}
            helperText={e?.county?.message}
          />
        </Grid>

        <Grid size={12}>
          <FormControlLabel
            control={
              <Switch
                checked={showMailing}
                onChange={(_, checked) => handleMailingToggle(checked)}
              />
            }
            label="Mailing address is different from physical address"
          />
        </Grid>

        {showMailing && (
          <>
            <Grid size={12}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Mailing Address
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Street Address"
                {...register('ownerInfo.mailingAddress.street')}
                error={!!e?.mailingAddress?.street}
                helperText={e?.mailingAddress?.street?.message}
              />
            </Grid>
            <Grid size={{ xs: 4, sm: 1 }}>
              <TextField
                label="Apt"
                {...register('ownerInfo.mailingAddress.apt')}
                error={!!e?.mailingAddress?.apt}
                helperText={e?.mailingAddress?.apt?.message}
              />
            </Grid>
            <Grid size={{ xs: 8, sm: 3 }}>
              <TextField
                label="City"
                {...register('ownerInfo.mailingAddress.city')}
                error={!!e?.mailingAddress?.city}
                helperText={e?.mailingAddress?.city?.message}
              />
            </Grid>
            <Grid size={{ xs: 4, sm: 2 }}>
              <Controller
                name="ownerInfo.mailingAddress.state"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    options={US_STATES}
                    getOptionLabel={(opt) => typeof opt === 'string' ? opt : `${opt.code} — ${opt.name}`}
                    value={US_STATES.find((s) => s.code === field.value) ?? null}
                    onChange={(_, val) => field.onChange(val?.code ?? '')}
                    isOptionEqualToValue={(opt, val) => opt.code === (typeof val === 'string' ? val : val.code)}
                    size="small"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="State"
                        error={!!e?.mailingAddress?.state}
                        helperText={e?.mailingAddress?.state?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 8, sm: 2 }}>
              <TextField
                label="ZIP Code"
                {...register('ownerInfo.mailingAddress.zip')}
                error={!!e?.mailingAddress?.zip}
                helperText={e?.mailingAddress?.zip?.message}
              />
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
}
