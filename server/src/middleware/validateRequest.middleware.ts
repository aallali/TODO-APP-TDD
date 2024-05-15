import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

const validateRequest = (schema: ZodSchema) =>
    (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({ errors: error.errors });
            }
            next(error);
        }
    };

export default validateRequest;
