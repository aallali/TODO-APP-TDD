import { z } from 'zod';


const taskValidatorSchema = z.object({
  title: z.string().min(3).max(30),
  description: z.string().min(3).max(100).optional(),
  status: z.enum(["pending", "done"] as const).optional()
});

export { taskValidatorSchema };
