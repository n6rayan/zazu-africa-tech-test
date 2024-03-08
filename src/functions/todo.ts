import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import {
  createTodo,
  removeTodo,
  retrieveTodo,
  updateTodo,
} from '../services/todo';

export const postTodo: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => createTodo(event);
export const deleteTodo: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => removeTodo(event);
export const getTodo: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => retrieveTodo(event);
export const patchTodo: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => updateTodo(event);