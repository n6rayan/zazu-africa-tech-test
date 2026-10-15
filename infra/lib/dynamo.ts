import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { TableV2, AttributeType } from 'aws-cdk-lib/aws-dynamodb';

export class DynamoStack extends Stack {
  public readonly table: TableV2;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.table = new TableV2(this, 'Table', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      tableName: 'todo-table',
      // To make sure it's torn down straight away when calling `cdk destroy`
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}
