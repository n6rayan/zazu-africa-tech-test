import { MiddlewareObj } from '@middy/core';
import { ZodSchema, ZodError } from 'zod';

export const validator = (
  schema: ZodSchema
): Pick<MiddlewareObj, 'before' | 'onError'> => ({
  before: async (request) => {
    console.log('Validation event received: ', JSON.stringify(request.event));
    try {
      request.event = await schema.parseAsync(request.event);
    } catch (err) {
      console.error('Error parsing payload', err);

      if (err instanceof ZodError) {
        const errors = err.issues.map((issue) => issue.message).join(', ');

        return {
          statusCode: 400,
          body: JSON.stringify({ errors }),
        };
      }
    }
  },
  onError: (request) => {
    console.log(request.error);

    return {
      statusCode: 400,
      body: JSON.stringify(request.error),
    };
  },
});

export * from './schemas';
