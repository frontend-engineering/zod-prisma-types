import { z } from 'zod'
import { Prisma } from '@prisma/client'

export const ModelWithCommentsUncheckedCreateInputSchema: z.ZodType<Omit<Prisma.ModelWithCommentsUncheckedCreateInput, "omitField" | "omitRequired">> = z.object({
  id: z.string().uuid().optional(),
  string: z.string().min(4).max(10).optional().nullable(),
  // omitted: omitField: z.string().optional().nullable(),
  // omitted: omitRequired: z.string(),
}).strict()

export default ModelWithCommentsUncheckedCreateInputSchema
