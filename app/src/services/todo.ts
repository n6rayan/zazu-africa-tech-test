import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuid } from 'uuid';
import { Event } from '@middy/http-json-body-parser';

import {
  createItem,
  deleteItem,
  getItem,
  updateItem,
  getItems,
} from '../libs/dynamo';
import {
  CreateBody,
  CreateToDoPayload,
  UpdateBody,
  UpdateToDoPayload,
  UpdateParams,
  DeleteParams,
  GetParams,
} from '../types';

export const createTodo = async (
  event: Event
): Promise<APIGatewayProxyResult> => {
  console.log('Event received: ', JSON.stringify(event));

  const body: CreateBody = event.body as CreateBody;

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
      statusCode: 201,
      body: JSON.stringify(todo.Attributes ?? todoPayload),
    };
  } catch (err: any) {
    console.log('Problem creating todo in Dynamo: ', err);

    return {
      statusCode: err.$metadata.httpStatusCode ?? 500,
      body: JSON.stringify({
        error: 'There was a problem creating the todo item',
      }),
    };
  }
};

export const updateTodo = async (event: Event) => {
  console.log('Event received: ', JSON.stringify(event));

  const body: UpdateBody = event.body as UpdateBody;
  const params: UpdateParams = event.pathParameters as UpdateParams;

  const todoPayload: UpdateToDoPayload = {
    ...(body.description && { description: body.description }),
    ...(body.complete && { complete: body.complete }),
    modifiedAt: new Date().toISOString(),
  };

  try {
    const todo = await updateItem(params.todoId, todoPayload);

    return {
      statusCode: 200,
      body: JSON.stringify({
        id: todo.Attributes?.id.S,
        description: todoPayload.description,
        complete: todoPayload.complete,
        modifiedAt: todoPayload.modifiedAt,
        createdAt: todo.Attributes?.createdAt.S,
      }),
    };
  } catch (err: any) {
    console.log('Problem updating the todo item in Dynamo: ', err);

    return {
      statusCode: err.$metadata.httpStatusCode ?? 500,
      body: JSON.stringify({
        error: 'There was a problem updating the todo item',
      }),
    };
  }
};

export const removeTodo = async (event: Event) => {
  console.log('Event received: ', JSON.stringify(event));

  const params: DeleteParams = event.pathParameters as DeleteParams;

  try {
    await deleteItem(params.todoId);

    return {
      statusCode: 204,
      body: JSON.stringify({}),
    };
  } catch (err: any) {
    console.log('Problem deleting the todo from Dynamo: ', err);

    return {
      statusCode: err.$metadata.statusCode ?? 500,
      body: JSON.stringify({
        error: 'There was a problem deleting the todo item',
      }),
    };
  }
};

export const retrieveTodo = async (event: Event) => {
  console.log('Event received: ', JSON.stringify(event));

  const params: GetParams = event.pathParameters as GetParams;

  try {
    const { Item: item } = await getItem(params.todoId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        id: item?.id.S,
        description: item?.description.S,
        complete: item?.complete.BOOL,
        createdAt: item?.createdAt.S,
        modifiedAt: item?.modifiedAt.S,
      }),
    };
  } catch (err: any) {
    console.log('Problem retrieving the todo item from Dynamo: ', err);

    return {
      statusCode: err.$metadata.statusCode ?? 500,
      body: JSON.stringify({
        error: 'There was a problem retrieving the todo item',
      }),
    };
  }
};

export const retrieveTodos = async (event: Event) => {
  console.log('Event received: ', JSON.stringify(event));

  try {
    const items = await getItems();

    const todos = items.Items?.map((item) => ({
      id: item.id.S,
      description: item.description.S,
      complete: item.complete.BOOL,
      modifiedAt: item.modifiedAt.S,
      createdAt: item.createdAt.S,
    })).sort(
      (a, b) =>
        +new Date(a.createdAt as string) - +new Date(b.createdAt as string)
    );

    return {
      statusCode: 200,
      body: JSON.stringify(todos),
    };
  } catch (err: any) {
    console.log('Problem retrieving the todo item from Dynamo: ', err);

    return {
      statusCode: err.$metadata.statusCode ?? 500,
      body: JSON.stringify({
        error: 'There was a problem retrieving the todo items',
      }),
    };
  }
};
