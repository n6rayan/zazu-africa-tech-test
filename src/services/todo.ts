import { APIGatewayProxyEvent } from 'aws-lambda';
import { v4 as uuid } from 'uuid';

import { createItem, deleteItem, getItem, updateItem } from '../libs/dynamo';
import { CreateToDoPayload, ToDo, UpdateToDoPayload } from '../types';

export const createTodo = async (event: APIGatewayProxyEvent) => {
  console.log('Event received: ', JSON.stringify(event));

  const body: { description: string } = JSON.parse(event.body ?? '{}');

  const todoPayload: CreateToDoPayload = {
    id: uuid(),
    description: body.description,
    complete: false,
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
  };

  try {
    const todo = await createItem(todoPayload);

    return {
      statusCode: 200,
      body: JSON.stringify(todo.Attributes ?? todoPayload),
    };
  } catch (err) {
    console.log('Problem creating todo in Dynamo: ', err);

    return {
      statusCode: err.$metadata.httpStatusCode ?? 500,
      body: JSON.stringify({
        error: 'There was a problem creating the todo',
      }),
    };
  }
};

export const updateTodo = async (event: APIGatewayProxyEvent) => {
  console.log('Event received: ', JSON.stringify(event));

  const body: { description: string, completed: boolean } = JSON.parse(event.body ?? '{}');
  const { pathParameters } = event;

  const todoPayload: UpdateToDoPayload = {
    description: body.description,
    complete: body.completed,
    modifiedAt: new Date().toISOString(),
  };

  try {
    const { Attributes: values } = await updateItem(pathParameters?.todoId, todoPayload);

    const response = {
      id: values?.id.S,
      description: values?.description.S,
      complete: values?.complete.BOOL,
      modifiedAt: values?.modifiedAt.S,
      updatedAt: values?.updatedAt.S,
    }

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (err) {
    console.log('Problem updating todo in Dynamo: ', err);

    return {
      statusCode: err.$metadata.httpStatusCode ?? 500,
      body: JSON.stringify({
        error: 'There was a problem updating the todo',
      }),
    };
  }
};

export const removeTodo = async (event: APIGatewayProxyEvent) => {
  console.log('Event received: ', JSON.stringify(event));

  const { pathParameters } = event;

  try {
    await deleteItem(pathParameters?.todoId);
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
  console.log('Event received: ', JSON.stringify(event));

  const { pathParameters } = event;

  try {
    const todo = await getItem(pathParameters?.todoId);

    return {
      statusCode: 200,
      body: JSON.stringify(todo.Item),
    };
  } catch (err) {
    console.log('Problem retrieving todo in Dynamo: ', err);

    return {
      statusCode: err.$metadata.statusCode ?? 500,
      body: JSON.stringify({
        error: 'There was a problem retrieving the todo',
      }),
    };
  }
};