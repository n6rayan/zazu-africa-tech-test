import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';
import jsonBodyParser, { Event } from '@middy/http-json-body-parser';
import middy from '@middy/core';

import {
  createTodo,
  removeTodo,
  retrieveTodo,
  updateTodo,
  retrieveTodos,
} from '../services/todo';
import {
  createTodoSchema,
  deleteTodoSchema,
  getTodoSchema,
  updateTodoSchema,
  validator,
} from '../middleware/validation';

const postTodo = async (event: Event) => createTodo(event);
export const createHandler: APIGatewayProxyHandler = middy<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
>()
  .use(jsonBodyParser())
  .use(validator(createTodoSchema))
  .handler(postTodo);

const deleteTodo = async (event: Event) => removeTodo(event);
export const deleteHandler: APIGatewayProxyHandler = middy<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
>()
  .use(validator(deleteTodoSchema))
  .handler(deleteTodo);

const getTodo = async (event: Event) => retrieveTodo(event);
export const getHandler: APIGatewayProxyHandler = middy<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
>()
  .use(validator(getTodoSchema))
  .handler(getTodo);

const getTodos = async (event: Event) => retrieveTodos(event);
export const getAllHandler: APIGatewayProxyHandler = middy<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
>().handler(getTodos);

const patchTodo = async (event: Event) => updateTodo(event);
export const patchHandler: APIGatewayProxyHandler = middy<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
>()
  .use(jsonBodyParser())
  .use(validator(updateTodoSchema))
  .handler(patchTodo);
