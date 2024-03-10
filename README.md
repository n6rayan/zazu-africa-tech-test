# Zazu Africa Tech Test

Technical test for Zazu Africa. A basic REST API with the ability to create a todo list and store the items in DynamoDB.

## App (app directory)

### Install Dependencies
- `npm i`

### Start Local Server
- `npm start` to run without Docker (make sure Dynamo is running locally on your machine)
- `docker compose up --build` to use the preconfigured services

### Run Integration Tests
- Make sure the server is running locally (see above)
- Run `npm test`

### Caveats
- Serverless Offline prepends the stage to every endpoint, so if you define a `GET /todo` endpoint, when running it offline with a stage of `local`, it would actually be `GET /local/todo`

### Example Requests

**Create ToDo**
```shell
curl -v -H 'Content-Type: application/json' -H 'Accept: application/json' -X POST http://0.0.0.0:3001/dev/api/todos -d '{"description": "some description"}'
```

**Update ToDo**
```shell
curl -v -H 'Content-Type: application/json' -H 'Accept: application/json' -X PATCH http://0.0.0.0:3001/dev/api/todos/{id} -d '{"description": "some description", "complete": true}'
```

**Delete ToDo**
```shell
curl -v -X DELETE http://0.0.0.0:3001/dev/api/todos/{id}
```

**Get ToDo**
```shell
curl -v -X GET http://0.0.0.0:3001/dev/api/todos/{id}
```

**Get All ToDos**
```shell
curl -v -X GET http://0.0.0.0:3001/dev/api/todos
```

## Infrastructure (infra directory)