import z from 'zod';

import {
  createTodoSchema,
  deleteTodoSchema,
  getTodoSchema,
  updateTodoSchema,
} from './middleware/schemas';

export interface ToDo {
  id: string;
  description: string;
  complete: boolean;
  createdAt: string;
  modifiedAt: string;
}

export type CreateToDoPayload = ToDo;
export type UpdateToDoPayload = Partial<Omit<ToDo, 'id' | 'createdAt'>>;

export type CreateBody = z.infer<typeof createTodoSchema>['body'];
export type UpdateBody = z.infer<typeof updateTodoSchema>['body'];
export type UpdateParams = z.infer<typeof updateTodoSchema>['pathParameters'];
export type DeleteParams = z.infer<typeof deleteTodoSchema>['pathParameters'];
export type GetParams = z.infer<typeof getTodoSchema>['pathParameters'];
