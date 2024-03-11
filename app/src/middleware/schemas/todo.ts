import z from 'zod';

export const createTodoSchema = z.object({
  body: z.object({
    description: z.string({
      required_error: 'Description is required',
      invalid_type_error: 'Description must be a string',
    }),
  }),
});

export const updateTodoSchema = z.object({
  pathParameters: z.object({
    todoId: z.string({
      required_error: 'ToDo ID is required',
      invalid_type_error: 'ToDo ID must be a string',
    }),
  }),
  body: z.object({
    description: z
      .string({
        invalid_type_error: 'Description must be a string',
      })
      .optional(),
    complete: z
      .boolean({
        invalid_type_error: 'Complete must be a boolean',
      })
      .optional(),
  }),
});

export const deleteTodoSchema = z.object({
  pathParameters: z.object({
    todoId: z.string({
      required_error: 'ToDo ID is required',
      invalid_type_error: 'ToDo ID must be a string',
    }),
  }),
});

export const getTodoSchema = z.object({
  pathParameters: z.object({
    todoId: z.string({
      required_error: 'ToDo ID is required',
      invalid_type_error: 'ToDo ID must be a string',
    }),
  }),
});
