import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Typography,
  Divider,
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import type { FormDataValues } from '../../validation/schemas';

const ITEMS = [
  { name: 'licensePlates', label: 'License Plates' },
  { name: 'registrationCard', label: 'Registration Card' },
  { name: 'yearSticker', label: 'Year Sticker' },
  { name: 'monthSticker', label: 'Month Sticker' },
  { name: 'vesselYearSticker', label: 'Vessel (Boat) Year Sticker' },
  { name: 'vesselCertificate', label: 'Vessel Certificate of Number' },
  { name: 'vesselMusselFee', label: 'Vessel Mussel Fee Sticker' },
  { name: 'disabledPlacard', label: 'Disabled Person Placard' },
  { name: 'disabledIdCard', label: 'Disabled Person ID Card' },
  { name: 'pnoCard', label: 'Planned Non-Operation (PNO) Card' },
  { name: 'pfrSticker', label: 'PFR Sticker' },
  { name: 'cvraWeightDecal', label: 'CVRA Weight Decal' },
  { name: 'cvraYearSticker', label: 'CVRA Year Sticker' },
  { name: 'trailerOhvIdCard', label: 'Trailer or OHV ID Card' },
] as const;

export default function ItemsRequestedStep() {
  const { control, formState: { errors } } = useFormContext<FormDataValues>();

  const rootError = errors.itemsRequested?.root;

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Section 2 — Plates, Stickers, Documents Request
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        I am requesting replacement of (check appropriate boxes):
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        NOTE: For replacement of missing License Plate, License Sticker, or Disabled Person Placard,
        if the original item is later located or received, the original item is no longer valid and
        must be destroyed or returned to DMV.
      </Typography>

      <Divider sx={{ mb: 1 }} />

      <FormControl error={!!rootError} component="fieldset">
        <FormGroup sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          {ITEMS.map(({ name, label }) => (
            <Controller
              key={name}
              name={`itemsRequested.${name}`}
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      size="small"
                    />
                  }
                  label={label}
                  sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                />
              )}
            />
          ))}
        </FormGroup>
        {rootError && <FormHelperText>{rootError.message}</FormHelperText>}
      </FormControl>
    </>
  );
}
