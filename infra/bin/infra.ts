#!/usr/bin/env node
import "source-map-support/register";
import { App } from "aws-cdk-lib";
import { ApiStack } from "../lib/api";
import { DynamoStack } from "../lib/dynamo";

const app = new App();
const env = {
  // Pinned: app/src/libs/dynamo.ts uses eu-west-2
  region: "eu-west-2",
  account: process.env.AWS_ACCOUNT_ID,
};

const dynamoStack = new DynamoStack(app, "DynamoStack", { env });
new ApiStack(app, "ApiStack", { env, table: dynamoStack.table });
