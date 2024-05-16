import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const ValidateRequest = (schema: ZodSchema) =>
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


export const ValidateParams = (schema: ZodSchema) =>
    (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            schema.parse(req.params);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({ errors: error.errors });
            }
            next(error);
        }
    };

