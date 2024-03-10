#!/usr/bin/env node
import "source-map-support/register";
import { App } from "aws-cdk-lib";
import { DynamoStack } from "../lib/dynamo";

const app = new App();
new DynamoStack(app, "DynamoStack", {
  env: {
    region: process.env.AWS_REGION,
    account: process.env.AWS_ACCOUNT_ID,
  }
});
