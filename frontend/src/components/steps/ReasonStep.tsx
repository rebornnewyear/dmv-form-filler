import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import type { FormDataValues } from '../../validation/schemas';

const REASONS = [
  { value: 'lost', label: 'Lost' },
  { value: 'stolen', label: 'Stolen' },
  { value: 'destroyed', label: 'Destroyed / Mutilated' },
  { value: 'notReceivedDmv', label: 'Not Received from DMV (allow 30 days)' },
  { value: 'notReceivedOwner', label: 'Not Received from Prior Owner' },
  { value: 'surrendered', label: 'Surrendered' },
  { value: 'specialPlatesRetained', label: 'Special Plates Retained by Owner' },
  { value: 'regCardCurrentAddr', label: 'Requesting Reg Card with Current Address' },
  { value: 'perCvc', label: 'Per CVC §4467 — Police report required' },
  { value: 'other', label: 'Other' },
] as const;

export default function ReasonStep() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<FormDataValues>();

  const reasonType = useWatch({ control, name: 'reason.type' });
  const needsExplanation = reasonType === 'stolen' || reasonType === 'other';
  const isSurrendered = reasonType === 'surrendered';

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Section 3 — The Item Requested Was
      </Typography>

      <Controller
        name="reason.type"
        control={control}
        render={({ field }) => (
          <FormControl error={!!errors.reason?.type} component="fieldset">
            <FormLabel component="legend">Check appropriate reason:</FormLabel>
            <RadioGroup {...field} value={field.value ?? ''}>
              {REASONS.map(({ value, label }) => (
                <FormControlLabel
                  key={value}
                  value={value}
                  control={<Radio size="small" />}
                  label={label}
                  sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                />
              ))}
            </RadioGroup>
            {errors.reason?.type && (
              <FormHelperText>{errors.reason.type.message}</FormHelperText>
            )}
          </FormControl>
        )}
      />

      {isSurrendered && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Number of plates surrendered to DMV:
          </Typography>
          <Controller
            name="reason.surrenderedCount"
            control={control}
            render={({ field }) => (
              <ToggleButtonGroup
                value={field.value ?? ''}
                exclusive
                onChange={(_, val) => { if (val) field.onChange(val); }}
                size="small"
              >
                <ToggleButton value="one">One</ToggleButton>
                <ToggleButton value="two">Two</ToggleButton>
              </ToggleButtonGroup>
            )}
          />
        </Box>
      )}

      {needsExplanation && (
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Explanation"
            multiline
            rows={3}
            {...register('reason.explanation')}
            error={!!errors.reason?.explanation}
            helperText={errors.reason?.explanation?.message}
            required
          />
        </Box>
      )}
    </>
  );
}
