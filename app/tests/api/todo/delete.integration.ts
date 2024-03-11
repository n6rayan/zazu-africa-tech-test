import supertest, { SuperTest, Test as STest } from 'supertest';

import { ToDo } from '../../../src/types';

describe('Update ToDo', () => {
  let request: SuperTest<STest>;
  let todo: ToDo;

  const payload = ({
    description = 'some description',
    complete = false,
  } = {}) => ({ description, complete });

  beforeAll(async () => {
    request = supertest('http://0.0.0.0:3001/dev');

    const create = await request.post(`/api/todos`).send(payload());
    todo = create.body;
  });

  it('should return a 204 and delete the row in the db', async () => {
    const response = await request.delete(`/api/todos/${todo.id}`);

    expect(response.statusCode).toEqual(204);
  });
});
