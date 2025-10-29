import { z } from 'zod';

const LocalizedValueSchema = z.object({
  fi: z.string(),
  sv: z.string().optional(),
  en: z.string().optional()
});

export const PropertySchema = z.object({
  id: z.string().min(1, 'ID is required'),
  slug: z.string().min(1, 'Slug is required'),
  
  address: LocalizedValueSchema,
  city: LocalizedValueSchema,
  postalCode: z.string().min(5, 'Postal code should be at least 5 characters'),
  
  // Phase 3: Rich content
  description: LocalizedValueSchema.optional(),
  descriptionTitle: LocalizedValueSchema.optional(),
  
  pricing: z.object({
    sales: z.number().nonnegative('Sales price cannot be negative'),
    debtFree: z.number().nonnegative('Debt-free price cannot be negative'),
    debt: z.number().nonnegative('Debt cannot be negative')
  }).refine(
    data => Math.abs((data.sales + data.debt) - data.debtFree) < 1,
    'Price math incorrect: sales + debt should equal debtFree'
  ),
  
  dimensions: z.object({
    living: z.number().positive('Living area must be positive'),
    total: z.number().positive().optional(),
    plot: z.number().positive().optional(),
    balcony: z.number().positive().optional(),
    terrace: z.number().positive().optional(),
    rooms: z.string().optional(),
    bedrooms: z.number().positive().optional(),
    bathrooms: z.number().positive().optional()
  }),
  
  // Phase 3: Fees
  fees: z.object({
    maintenance: z.number().nonnegative().optional(),
    financing: z.number().nonnegative().optional(),
    water: z.number().nonnegative().optional(),
    heating: z.number().nonnegative().optional(),
    electricity: z.number().nonnegative().optional(),
    parking: z.number().nonnegative().optional(),
    sauna: z.number().nonnegative().optional()
  }),
  
  // Phase 3: Features
  features: z.object({
    balcony: z.boolean().optional(),
    terrace: z.boolean().optional(),
    sauna: z.boolean().optional(),
    fireplace: z.boolean().optional(),
    storageRoom: z.boolean().optional(),
    parkingSpace: z.boolean().optional()
  }),
  
  meta: z.object({
    status: z.enum(['ACTIVE', 'SOLD', 'RESERVED']).optional(),
    floor: z.string().optional(),
    housingCompany: z.object({
      name: LocalizedValueSchema.optional(),
      loans: z.number().nullable(),
      encumbrances: z.number().nullable(),
      loansDate: z.string().optional()
    })
  }).passthrough(), // Allow other fields
  
  media: z.object({
    images: z.array(z.object({
      url: z.string().url('Image URL must be valid'),
      thumb: z.string().optional(),
      floorPlan: z.boolean().optional()
    })),
    coordinates: z.object({
      lat: z.number().min(-90).max(90),
      lon: z.number().min(-180).max(180)
    }).optional()
  }),
  
  // Phase 3: Documents
  documents: z.object({
    floorPlan: z.string().url().optional(),
    brochure: z.string().url().optional(),
    brochureIntl: z.string().url().optional(),
    video: z.string().url().optional(),
    energyCert: z.string().url().optional()
  }),
  
  agent: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Agent email must be valid').optional(),
    photoUrl: z.string().url().optional(),
    title: z.string().optional()
  }).optional(),
  
  // Phase 3: Rental
  rental: z.object({
    monthlyRent: z.number().positive(),
    securityDeposit: LocalizedValueSchema.optional(),
    contractType: LocalizedValueSchema.optional(),
    earliestTermination: LocalizedValueSchema.optional(),
    petsAllowed: z.boolean().optional(),
    smokingAllowed: z.boolean().optional()
  }).optional()
}).passthrough();

export type PropertyValidationResult = {
  success: boolean;
  data?: any;
  warnings: Array<{ path: string; message: string }>;
};

/**
 * Validate property with warnings instead of throwing
 */
export function validateProperty(property: unknown): PropertyValidationResult {
  const result = PropertySchema.safeParse(property);
  
  if (result.success) {
    return {
      success: true,
      data: result.data,
      warnings: []
    };
  }
  
  return {
    success: false,
    warnings: result.error.issues.map(issue => ({
      path: issue.path.join('.'),
      message: issue.message
    }))
  };
}

