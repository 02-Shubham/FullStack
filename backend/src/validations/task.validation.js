import { z } from 'zod';

const uuidParamSchema = z.object({
  id: z.string().uuid('Task id must be a valid UUID'),
});

const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  completed: z
    .enum(['true', 'false'])
    .optional()
    .transform((value) => (value === undefined ? undefined : value === 'true')),
  search: z.string().trim().max(100).optional(),
});

export const listTasksSchema = z.object({
  query: paginationQuerySchema,
});

export const taskIdSchema = z.object({
  params: uuidParamSchema,
});

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().trim().min(2, 'Title must be at least 2 characters').max(120),
    description: z.string().trim().max(1000).optional(),
    completed: z.boolean().optional(),
  }),
});

export const updateTaskSchema = z.object({
  params: uuidParamSchema,
  body: z
    .object({
      title: z.string().trim().min(2, 'Title must be at least 2 characters').max(120).optional(),
      description: z.string().trim().max(1000).optional().nullable(),
      completed: z.boolean().optional(),
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: 'At least one field is required',
    }),
});
