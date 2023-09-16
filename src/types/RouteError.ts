import { ZodError } from "zod";

export type RouteError<ZodSchemaType = unknown> = ZodSchemaType extends object
  ? {
      cause: ZodError<ZodSchemaType>;
      message: string;
      routerCode: string;
      stack: string;
    }
  : {
      message: string;
      stack: string;
    };
