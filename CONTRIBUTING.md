# Contributing

This repo has two independent npm projects, each with its own `package.json` and `package-lock.json`:

- `app/` – the ToDo REST API (Serverless Framework, Middy, Zod, DynamoDB)
- `infra/` – the AWS CDK stack used to deploy it

Run the commands below from inside the relevant directory.

## Prerequisites

- Node.js 20 below 20.19 (for example `nvm install 20.18`). `app/.nvmrc` only says `v20`, so `nvm use` may install a newer 20.x. Node 20.19+ and 22.12+ enable `require(esm)` by default, which breaks serverless 3 loading `serverless-offline` (`TypeError: Cannot redefine property: _serverlessExternalPluginName`). If you can't use an older Node, prefix `npm start` with `NODE_OPTIONS=--no-experimental-require-module`
- npm (bundled with Node.js)
- Docker with Docker Compose, if you want the preconfigured local setup
- AWS credentials are only needed to deploy the CDK stack. For `npm start` any dummy credentials are enough (see below); docker-compose sets them up itself

## Install dependencies

From `app/`:

```shell
npm ci     # or `npm i`
```

From `infra/` (only if you are working on the infrastructure):

```shell
npm ci
```

## Run the app locally

From `app/`, either:

- Use Docker. This starts DynamoDB Local, creates the `todo-table` table and runs the API:

  ```shell
  docker compose up --build
  ```

  Note: `app/Dockerfile` uses `node:20-alpine`, which now resolves to a Node 20.19+ release, so the Node issue above may affect this path too. This has not been verified.

- Or run without Docker, using Serverless Offline (`sls offline`):

  ```shell
  AWS_ACCESS_KEY_ID=local AWS_SECRET_ACCESS_KEY=local npm start
  ```

  The AWS SDK needs credentials to be present, otherwise every request fails with `CredentialsProviderError`; dummy values like the above are fine for DynamoDB Local. This needs a DynamoDB instance reachable locally that already has a `todo-table` table (partition key `id`, type string). If it is not at the default AWS endpoint, set `AWS_DYNAMODB_ENDPOINT` (for example `http://localhost:8000`). The region is fixed to `eu-west-2` in `src/libs/dynamo.ts`.

The API is served on port 3001. Serverless Offline prefixes routes with the stage (default `dev`), so the todos endpoint is `http://0.0.0.0:3001/dev/api/todos`. See the README for example `curl` requests and `app/openapi.yml` for the API spec.

## Tests

The `app/` tests are integration tests (`app/tests/**/*.integration.ts`) that call the running server at `http://0.0.0.0:3001/dev`. Start the server first (see above), then in a separate terminal, from `app/`:

```shell
npm run test:integration
```

The `infra/` project has a placeholder Jest test (the CDK template default, so it always passes), run from `infra/`:

```shell
npm test
```

## Linting and formatting

From `app/`:

```shell
npm run lint           # ESLint, fails on any warning
npm run pretty:check   # check Prettier formatting
npm run pretty:write   # fix Prettier formatting
```

Please run `npm run lint` and `npm run pretty:check` before opening a pull request.

Note: `npm run pretty:check` currently reports formatting problems in `tests/api/todo/create.integration.ts` and `tests/api/todo/update.integration.ts`, which predate your changes. Just make sure you don't add new ones.
