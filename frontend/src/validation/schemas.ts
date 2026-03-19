import { z } from 'zod';

const addressSchema = z.object({
  street: z.string().min(1, 'Street is required').max(100),
  apt: z.string().max(20).optional().or(z.literal('')),
  city: z.string().min(1, 'City is required').max(50),
  state: z.string().min(1, 'State is required').max(2),
  zip: z
    .string()
    .min(1, 'ZIP is required')
    .regex(/^\d{5}(-\d{4})?$/, 'Must be 5 digits or 5+4 format'),
});

export const vehicleInfoSchema = z.object({
  licensePlate: z.string().min(1, 'License plate is required').max(10),
  make: z.string().min(1, 'Make is required').max(30),
  vin: z
    .string()
    .min(1, 'VIN is required')
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/, 'VIN must be 17 characters (no I, O, Q)'),
  dpPlacardNumber: z.string().max(20).optional().or(z.literal('')),
  birthDate: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Use MM/DD/YYYY')
    .optional()
    .or(z.literal('')),
  engineNumber: z.string().max(20).optional().or(z.literal('')),
});

export const ownerInfoSchema = z.object({
  fullName: z.string().min(1, 'Owner name is required').max(100),
  dlNumber: z.string().max(20).optional().or(z.literal('')),
  coOwnerFullName: z.string().max(100).optional().or(z.literal('')),
  coOwnerDlNumber: z.string().max(20).optional().or(z.literal('')),
  physicalAddress: addressSchema,
  county: z.string().max(50).optional().or(z.literal('')),
  mailingAddress: addressSchema.optional(),
});

export const itemsRequestedSchema = z
  .object({
    licensePlates: z.boolean().optional(),
    registrationCard: z.boolean().optional(),
    yearSticker: z.boolean().optional(),
    monthSticker: z.boolean().optional(),
    vesselYearSticker: z.boolean().optional(),
    vesselCertificate: z.boolean().optional(),
    vesselMusselFee: z.boolean().optional(),
    disabledPlacard: z.boolean().optional(),
    disabledIdCard: z.boolean().optional(),
    pnoCard: z.boolean().optional(),
    pfrSticker: z.boolean().optional(),
    cvraWeightDecal: z.boolean().optional(),
    cvraYearSticker: z.boolean().optional(),
    trailerOhvIdCard: z.boolean().optional(),
  })
  .refine(
    (data) => Object.values(data).some(Boolean),
    { message: 'Select at least one item' },
  );

export const reasonSchema = z
  .object({
    type: z.enum(
      [
        'lost', 'stolen', 'destroyed', 'notReceivedDmv', 'notReceivedOwner',
        'surrendered', 'specialPlatesRetained', 'regCardCurrentAddr', 'perCvc', 'other',
      ],
      { required_error: 'Select a reason' },
    ),
    explanation: z.string().max(500).optional().or(z.literal('')),
    surrenderedCount: z.enum(['one', 'two']).optional(),
  })
  .refine(
    (data) => {
      if (data.type === 'stolen' || data.type === 'other') {
        return !!data.explanation && data.explanation.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Explanation is required when reason is Stolen or Other',
      path: ['explanation'],
    },
  );

export const certificationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  title: z.string().max(50).optional().or(z.literal('')),
  phone: z.string().min(1, 'Phone is required').max(20),
  date: z
    .string()
    .min(1, 'Date is required')
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Use MM/DD/YYYY'),
  email: z.string().email('Invalid email').max(100).optional().or(z.literal('')),
});

export const formDataSchema = z.object({
  vehicleInfo: vehicleInfoSchema,
  ownerInfo: ownerInfoSchema,
  itemsRequested: itemsRequestedSchema,
  reason: reasonSchema,
  certification: certificationSchema,
});

export type FormDataValues = z.infer<typeof formDataSchema>;
