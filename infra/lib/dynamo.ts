import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { TableV2, AttributeType } from 'aws-cdk-lib/aws-dynamodb';

export class DynamoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new TableV2(this, 'Table', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      tableName: 'todo-table',
      // To make sure it's torn down straight away when calling `cdk destroy`
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}
