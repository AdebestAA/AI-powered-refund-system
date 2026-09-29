import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";
import { createError } from "../utils/app-error";
import { dynamicSchema } from "../utils/dynamic-schema";

type Schemas = {
  body?: ZodObject;
  query?: ZodObject;
  params?: ZodObject;
};

export const validate =
  (schemas: Schemas) => (req: Request, res: Response, next: NextFunction) => {
    for (const key of ["body", "params", "query"] as const) {
      const schema = schemas[key];
      if (!schema) continue;

      const result = dynamicSchema(schema, req[key] ?? {});
      if (!result.success) {
        return next(createError(422, result.message));
      }

      if (key === "query") res.locals.query = result.data;
      else req[key] = result.data as never;
    }
    next();
  };
