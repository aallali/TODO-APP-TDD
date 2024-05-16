import { z } from 'zod';
import { ObjectId } from 'mongodb';

// Base schema for task
const taskBaseSchema = z.object({
  title: z.string().min(3).max(50),
  description: z.string().min(3).max(100).optional(),
  status: z.enum(["pending", "done"] as const).optional()
});

// Validator schema for creating a new task
const newTaskValidatorSchema = taskBaseSchema;

const idValidator = z.string().refine(value => {
  // Validate if the 'id' is a valid MongoDB ObjectId
  return ObjectId.isValid(value);
}, {
  message: "Invalid MongoDB ObjectId"
})


const idInParamSchema = z.object({
  id: idValidator
})

// Validator schema for update, where at least one field should exist
const updateWithAtLeastOneFieldValidatorSchema = z.object({
  id: idValidator,
  ...taskBaseSchema.partial().shape
}).refine(data => {
  return Object.keys(data).length > 1; // 'id' plus at least one field should exist
}, {
  message: "At least one field other than 'id' is required for update"
});


export { newTaskValidatorSchema, updateWithAtLeastOneFieldValidatorSchema, idInParamSchema };
