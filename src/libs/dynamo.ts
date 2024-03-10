import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandOutput,
  PutItemInput,
  DeleteItemCommand,
  DeleteItemCommandOutput,
  DeleteItemInput,
  GetItemCommand,
  GetItemCommandOutput,
  GetItemInput,
  UpdateItemCommand,
  UpdateItemCommandOutput,
  UpdateItemInput,
  ScanCommand,
  ScanCommandInput,
  ScanCommandOutput,
} from '@aws-sdk/client-dynamodb';

import { CreateToDoPayload, UpdateToDoPayload } from '../types';
import config from '../config';

const client = new DynamoDBClient({ ...config.dynamodb });

export const createItem = async (
  data: CreateToDoPayload
): Promise<PutItemCommandOutput> => {
  const input: PutItemInput = {
    TableName: 'todo-table',
    Item: {
      id: {
        S: data.id,
      },
      description: {
        S: data.description,
      },
      complete: {
        BOOL: data.complete,
      },
      createdAt: {
        S: data.createdAt,
      },
      modifiedAt: {
        S: data.modifiedAt,
      },
    },
    // @todo: For some reason DDB is not returning the values after insert
    ReturnValues: 'ALL_OLD',
  };

  const command = new PutItemCommand(input);
  return await client.send(command);
};

export const updateItem = async (
  id: string | undefined,
  data: UpdateToDoPayload
): Promise<UpdateItemCommandOutput> => {
  const input: UpdateItemInput = {
    TableName: 'todo-table',
    Key: {
      id: {
        S: String(id),
      },
    },
    AttributeUpdates: {
      ...(data.description && {
        description: {
          Value: { S: data.description },
          Action: 'PUT',
        },
      }),
      ...(data.complete && {
        complete: {
          Value: { BOOL: data.complete },
          Action: 'PUT',
        },
      }),
      ...(data.modifiedAt && {
        modifiedAt: {
          Value: { S: data.modifiedAt },
          Action: 'PUT',
        },
      }),
    },
    ReturnValues: 'ALL_OLD',
  };

  const command = new UpdateItemCommand(input);
  return await client.send(command);
};

export const deleteItem = async (
  id: string | undefined
): Promise<DeleteItemCommandOutput> => {
  const params: DeleteItemInput = {
    TableName: 'todo-table',
    Key: {
      id: {
        S: String(id),
      },
    },
  };

  const command = new DeleteItemCommand(params);
  return await client.send(command);
};

export const getItem = async (
  id: string | undefined
): Promise<GetItemCommandOutput> => {
  const params: GetItemInput = {
    TableName: 'todo-table',
    Key: {
      id: {
        S: String(id),
      },
    },
  };

  const command = new GetItemCommand(params);
  return await client.send(command);
};

export const getItems = async (): Promise<ScanCommandOutput> => {
  const params: ScanCommandInput = {
    TableName: 'todo-table',
    Select: 'ALL_ATTRIBUTES',
  };

  const command = new ScanCommand(params);
  return await client.send(command);
};
