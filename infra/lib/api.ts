import * as path from 'path';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { ITableV2 } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export interface ApiStackProps extends StackProps {
  table: ITableV2;
  stage?: string;
}

const APP_DIR = path.join(__dirname, '..', '..', 'app');

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const stage = props.stage ?? 'dev';

    const api = new RestApi(this, 'Api', {
      restApiName: 'zazu-africa-rest-api',
      deployOptions: { stageName: stage },
    });

    const todos = api.root.addResource('api').addResource('todos');
    const todo = todos.addResource('{todoId}');

    const routes = [
      { name: 'createItem', handler: 'createHandler', resource: todos, method: 'POST' },
      { name: 'getItems', handler: 'getAllHandler', resource: todos, method: 'GET' },
      { name: 'getItem', handler: 'getHandler', resource: todo, method: 'GET' },
      { name: 'patchItem', handler: 'patchHandler', resource: todo, method: 'PATCH' },
      { name: 'deleteItem', handler: 'deleteHandler', resource: todo, method: 'DELETE' },
    ];

    for (const route of routes) {
      const fn = new NodejsFunction(this, route.name, {
        entry: path.join(APP_DIR, 'src', 'functions', 'todo.ts'),
        depsLockFilePath: path.join(APP_DIR, 'package-lock.json'),
        projectRoot: APP_DIR,
        handler: route.handler,
        runtime: Runtime.NODEJS_20_X,
        environment: { ENVIRONMENT: stage },
      });

      grantTableAccess(props.table, fn);
      route.resource.addMethod(route.method, new LambdaIntegration(fn));
    }
  }
}

const grantTableAccess = (table: ITableV2, fn: NodejsFunction) =>
  table.grant(
    fn,
    'dynamodb:UpdateItem',
    'dynamodb:GetItem',
    'dynamodb:DeleteItem',
    'dynamodb:PutItem',
    'dynamodb:Scan'
  );
