import { APIGatewayProxyEvent } from 'aws-lambda';

import { createItem, deleteItem, getItem, updateItem } from '../libs/dynamo';
import { ToDo } from '../types';

export const createTodo = async (event: APIGatewayProxyEvent) => {
  console.log('Event received: ', event);

  const body: { description: string } = JSON.parse(event.body ?? '{}');

  const todo: ToDo = {
    description: body.description,
    complete: false,
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
  };

  try {
    createItem(todo);
  } catch (err) {
    console.log('Problem creating todo in Dynamo: ', err);

    return {
      statusCode: err.$metadata.httpStatusCode ?? 500,
      body: JSON.stringify({
        error: 'There was a problem creating the todo',
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(todo),
  };
};

export const updateTodo = async (event: APIGatewayProxyEvent) => {
  console.log('Event received: ', event);

  const body: { description: string, completed: boolean } = JSON.parse(event.body ?? '{}');
  const { pathParameters } = event;

  const todo: ToDo = {
    description: body.description,
    complete: body.completed,
    modifiedAt: new Date().toISOString(),
  };

  try {
    updateItem(pathParameters?.todoId, todo);
  } catch (err) {
    console.log('Problem updating todo in Dynamo: ', err);

    return {
      statusCode: err.$metadata.httpStatusCode ?? 500,
      body: JSON.stringify({
        error: 'There was a problem updating the todo',
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(todo),
  };
};

export const removeTodo = async (event: APIGatewayProxyEvent) => {
  console.log('Event received: ', event);

  const { pathParameters } = event;

  try {
    deleteItem(pathParameters?.todoId);
  } catch (err) {
    console.log('Problem deleting todo in Dynamo: ', err);

    return {
      statusCode: err.$metadata.statusCode ?? 500,
      body: JSON.stringify({
        error: 'There was a problem deleting the todo',
      }),
    };
  }

  return {
    statusCode: 204,
    body: JSON.stringify({})
  };
};

export const retrieveTodo = async (event: APIGatewayProxyEvent) => {
  console.log('Event received: ', event);

  const { pathParameters } = event;

  try {
    getItem(pathParameters?.todoId);
  } catch (err) {
    console.log('Problem retrieving todo in Dynamo: ', err);

    return {
      statusCode: err.$metadata.statusCode ?? 500,
      body: JSON.stringify({
        error: 'There was a problem retrieving the todo',
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      id: 'some-id',
      description: 'some description',
      complete: true,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
    }),
  };
};