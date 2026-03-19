import { useState } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  formDataSchema,
  vehicleInfoSchema,
  ownerInfoSchema,
  itemsRequestedSchema,
  reasonSchema,
  certificationSchema,
  type FormDataValues,
} from '../validation/schemas';
import { generatePdf, extractApiErrors } from '../services/api';
import VehicleInfoStep from './steps/VehicleInfoStep';
import OwnerInfoStep from './steps/OwnerInfoStep';
import ItemsRequestedStep from './steps/ItemsRequestedStep';
import ReasonStep from './steps/ReasonStep';
import CertificationStep from './steps/CertificationStep';
import type { z } from 'zod';
import type { FieldErrors } from 'react-hook-form';

const STEPS = [
  { label: 'Vehicle Info', schema: vehicleInfoSchema, field: 'vehicleInfo' },
  { label: 'Registered Owner', schema: ownerInfoSchema, field: 'ownerInfo' },
  { label: 'Items Requested', schema: itemsRequestedSchema, field: 'itemsRequested' },
  { label: 'Reason', schema: reasonSchema, field: 'reason' },
  { label: 'Certification', schema: certificationSchema, field: 'certification' },
] as const;

const STEP_COMPONENTS = [
  VehicleInfoStep,
  OwnerInfoStep,
  ItemsRequestedStep,
  ReasonStep,
  CertificationStep,
];

function collectErrorMessages(errors: FieldErrors, prefix = ''): string[] {
  const messages: string[] = [];
  for (const [key, value] of Object.entries(errors)) {
    if (!value) continue;
    const path = prefix ? `${prefix}.${key}` : key;
    if (value.message && typeof value.message === 'string') {
      messages.push(value.message);
    } else if (typeof value === 'object') {
      messages.push(...collectErrorMessages(value as FieldErrors, path));
    }
  }
  return messages;
}

const SNACKBAR_DURATION_MS = 5000;

export default function FormWizard() {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessages, setSnackMessages] = useState<string[]>([]);

  const methods = useForm<FormDataValues>({
    resolver: zodResolver(formDataSchema),
    mode: 'onTouched',
    defaultValues: {
      vehicleInfo: { licensePlate: '', make: '', vin: '' },
      ownerInfo: {
        fullName: '',
        physicalAddress: { street: '', apt: '', city: '', state: '', zip: '' },
      },
      itemsRequested: {},
      reason: { type: undefined as unknown as FormDataValues['reason']['type'] },
      certification: { name: '', phone: '', date: '' },
    },
  });

  const showValidationToast = (msgs: string[]) => {
    setSnackMessages(msgs.length > 0 ? msgs : ['Please fill in all required fields']);
    setSnackOpen(true);
  };

  const validateCurrentStep = async (): Promise<boolean> => {
    const step = STEPS[activeStep];
    const values = methods.getValues(step.field);

    try {
      (step.schema as z.ZodType).parse(values);
      await methods.trigger(step.field);
      const fieldErrors = methods.formState.errors[step.field];
      if (fieldErrors) {
        const msgs = collectErrorMessages({ [step.field]: fieldErrors });
        showValidationToast(msgs);
        return false;
      }
      return true;
    } catch {
      await methods.trigger(step.field);
      const fieldErrors = methods.formState.errors[step.field];
      const msgs = fieldErrors
        ? collectErrorMessages({ [step.field]: fieldErrors })
        : ['Please fill in all required fields'];
      showValidationToast(msgs);
      return false;
    }
  };

  const handleNext = async () => {
    const valid = await validateCurrentStep();
    if (valid) {
      setActiveStep((prev) => prev + 1);
      setApiErrors([]);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setApiErrors([]);
  };

  const handleSubmit = async () => {
    const valid = await validateCurrentStep();
    if (!valid) return;

    const allValid = await methods.trigger();
    if (!allValid) {
      const msgs = collectErrorMessages(methods.formState.errors);
      showValidationToast(msgs);
      return;
    }

    setLoading(true);
    setApiErrors([]);
    setSuccess(false);

    try {
      const data = methods.getValues();
      await generatePdf(data);
      setSuccess(true);
    } catch (err) {
      setApiErrors(extractApiErrors(err));
    } finally {
      setLoading(false);
    }
  };

  const StepComponent = STEP_COMPONENTS[activeStep];
  const isLastStep = activeStep === STEPS.length - 1;

  return (
    <FormProvider {...methods}>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {STEPS.map(({ label }) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ minHeight: 300 }}>
        <StepComponent />
      </Box>

      {apiErrors.length > 0 && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {apiErrors.map((msg, i) => (
            <div key={i}>{msg}</div>
          ))}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          PDF generated and downloaded successfully!
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined">
          Back
        </Button>

        {isLastStep ? (
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : undefined}
          >
            {loading ? 'Generating...' : 'Generate PDF'}
          </Button>
        ) : (
          <Button onClick={handleNext} variant="contained">
            Next
          </Button>
        )}
      </Box>

      <Snackbar
        open={snackOpen}
        autoHideDuration={SNACKBAR_DURATION_MS}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity="warning"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackMessages.map((msg, i) => (
            <div key={i}>{msg}</div>
          ))}
        </Alert>
      </Snackbar>
    </FormProvider>
  );
}
