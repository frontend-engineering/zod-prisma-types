import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { SortOrderSchema } from './SortOrderSchema';

export const ModelWithCommentsMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ModelWithCommentsMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  string: z.lazy(() => SortOrderSchema).optional(),
  omitField: z.lazy(() => SortOrderSchema).optional(),
  omitRequired: z.lazy(() => SortOrderSchema).optional(),
}).strict()

export default ModelWithCommentsMaxOrderByAggregateInputSchema
