import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { SortOrderSchema } from './SortOrderSchema';

export const LocationAvgOrderByAggregateInputSchema: z.ZodType<Prisma.LocationAvgOrderByAggregateInput> = z.object({
  lat: z.lazy(() => SortOrderSchema).optional(),
  lng: z.lazy(() => SortOrderSchema).optional(),
}).strict()

export default LocationAvgOrderByAggregateInputSchema
