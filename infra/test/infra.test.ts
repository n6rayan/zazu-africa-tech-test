import { App } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { ApiStack } from '../lib/api';
import { DynamoStack } from '../lib/dynamo';

describe('stacks', () => {
  const app = new App();
  const dynamoStack = new DynamoStack(app, 'TestDynamoStack');
  const apiStack = new ApiStack(app, 'TestApiStack', {
    table: dynamoStack.table,
  });

  test('creates the todo table', () => {
    Template.fromStack(dynamoStack).hasResourceProperties(
      'AWS::DynamoDB::GlobalTable',
      { TableName: 'todo-table' }
    );
  });

  test('creates a Node 20 lambda per route', () => {
    const template = Template.fromStack(apiStack);
    template.resourceCountIs('AWS::Lambda::Function', 5);
    template.hasResourceProperties('AWS::Lambda::Function', {
      Runtime: 'nodejs20.x',
      Handler: 'index.createHandler',
    });
  });

  test('exposes the todo routes on the dev stage', () => {
    const template = Template.fromStack(apiStack);
    template.hasResourceProperties('AWS::ApiGateway::Stage', {
      StageName: 'dev',
    });
    template.resourceCountIs('AWS::ApiGateway::Method', 5);
    for (const method of ['POST', 'GET', 'PATCH', 'DELETE']) {
      template.hasResourceProperties('AWS::ApiGateway::Method', {
        HttpMethod: method,
      });
    }
    template.hasResourceProperties('AWS::ApiGateway::Resource', {
      PathPart: '{todoId}',
    });
  });

  test('grants lambdas table access', () => {
    Template.fromStack(apiStack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: [
              'dynamodb:UpdateItem',
              'dynamodb:GetItem',
              'dynamodb:DeleteItem',
              'dynamodb:PutItem',
              'dynamodb:Scan',
            ],
            Effect: 'Allow',
          }),
        ]),
      },
    });
  });
});
