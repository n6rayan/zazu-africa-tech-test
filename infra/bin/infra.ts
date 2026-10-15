#!/usr/bin/env node
import "source-map-support/register";
import { App } from "aws-cdk-lib";
import { ApiStack } from "../lib/api";
import { DynamoStack } from "../lib/dynamo";

const app = new App();
const env = {
  region: process.env.AWS_REGION,
  account: process.env.AWS_ACCOUNT_ID,
};

const dynamoStack = new DynamoStack(app, "DynamoStack", { env });
new ApiStack(app, "ApiStack", { env, table: dynamoStack.table });
