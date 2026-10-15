# Zazu Africa Tech Test

A REST API for managing a todo list, built on AWS Lambda and API Gateway with DynamoDB as the data store.

The repo has two packages:

| Directory | Contents |
| --------- | -------- |
| `app`     | Serverless API (Lambda handlers, DynamoDB access, tests) |
| `infra`   | AWS CDK stack |

## App (`app/`)

### Setup

```shell
npm i
```

### Run locally

Without Docker (requires a local DynamoDB instance):

```shell
npm start
```

With Docker, using the preconfigured services:

```shell
docker compose up --build
```

### Integration tests

Start the server locally (see above), then run:

```shell
npm run test:integration
```

### Notes

- Serverless Offline prefixes every route with the stage. With the `local` stage, `GET /todo` is served at `GET /local/todo`.

### API

Base URL when running locally: `http://0.0.0.0:3001/dev/api`

| Method   | Path          | Description    |
| -------- | ------------- | -------------- |
| `POST`   | `/todos`      | Create a todo  |
| `GET`    | `/todos`      | List all todos |
| `GET`    | `/todos/{id}` | Get a todo     |
| `PATCH`  | `/todos/{id}` | Update a todo  |
| `DELETE` | `/todos/{id}` | Delete a todo  |

#### Example requests

Create a todo:

```shell
curl -v -H 'Content-Type: application/json' -H 'Accept: application/json' -X POST http://0.0.0.0:3001/dev/api/todos -d '{"description": "some description"}'
```

Update a todo:

```shell
curl -v -H 'Content-Type: application/json' -H 'Accept: application/json' -X PATCH http://0.0.0.0:3001/dev/api/todos/{id} -d '{"description": "some description", "complete": true}'
```

Delete a todo:

```shell
curl -v -X DELETE http://0.0.0.0:3001/dev/api/todos/{id}
```

Get a todo:

```shell
curl -v -X GET http://0.0.0.0:3001/dev/api/todos/{id}
```

Get all todos:

```shell
curl -v -X GET http://0.0.0.0:3001/dev/api/todos
```

## Infrastructure (`infra/`)

### Setup

```shell
npm i
```

### Deploy and destroy

1. Assume the target role:

   ```shell
   AWS_PROFILE=${PROFILE} aws sts assume-role --role-arn arn:aws:iam::${ACCOUNT_ID}:role/OrganizationAccountAccessRole --role-session-name cdk
   ```

2. Export the returned access key, secret key and session token in your shell.
3. Deploy the stack:

   ```shell
   AWS_REGION=${REGION} AWS_ACCOUNT_ID=${ACCOUNT_ID} npx cdk deploy
   ```

4. Tear it down when finished:

   ```shell
   AWS_REGION=${REGION} AWS_ACCOUNT_ID=${ACCOUNT_ID} npx cdk destroy
   ```

## Tooling

- **Serverless Framework**: simplifies Lambda and API Gateway setup.
- **Middy**: Lambda middleware, including the body parser and a custom Zod validator.
- **Zod**: validates request bodies and path parameters.
- **Docker / serverless-offline**: local development.
- **Prettier / ESLint**: code style and linting.
- **Jest / Supertest**: integration tests.

## Design notes

### Error handling

- Middy runs the Zod validators on the incoming event before any handler logic executes.
- Once validation passes, building the data and calling the DynamoDB client is wrapped in a `try/catch`.
- Caught errors are logged, and the client receives a generic error response so internals aren't exposed.

### Authentication

Not implemented. A possible approach:

- Use an identity provider such as Auth0 or Cognito. Clients send the access token with each API request.
- Add a custom Middy middleware that reads the token from the event and validates it against the provider's keys (JWKS).
