import { z } from 'zod';

// allali 6

const userValidatorSchema = z.object({
  username: z.string()
    .regex(
      /^[a-zA-Z0-9]{3,10}$/,
      'Username must be at between 3-10 characters long (alpha-numeric only)'
    ),
  password: z.string()
    .regex(
      /^[a-zA-Z0-9]{3,10}$/,
      'Password must be at between 3-10 characters long (alpha-numeric only)'
    ),
});

export { userValidatorSchema };
