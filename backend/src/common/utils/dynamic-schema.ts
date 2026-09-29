import { z, ZodObject } from "zod";

type FieldErrors = Record<string, string[] | undefined>;

export type SchemaResult<T> =
  | { success: true; data: T }
  | { success: false; message: string; errors: FieldErrors };

export const dynamicSchema = <T extends ZodObject>(
  schema: T,
  data: unknown,
): SchemaResult<z.infer<T>> => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = z.flattenError(result.error).fieldErrors as FieldErrors;

    return {
      success: false,
      message: result.error.issues[0]?.message ?? "Validation Failed",
      errors,
    };
  }

  return {
    success: true,
    data: result.data,
  };
};
