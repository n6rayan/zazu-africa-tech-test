import supertest, { SuperTest, Test as STest } from 'supertest';
import { v4 as uuid } from 'uuid';

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

  afterAll(async () => {
    // perform cleanup
    await request.delete(`/api/todos/${todo.id}`);
  })

  it('should return a 200 and update the row in the db', async () => {
    const updatePayload = payload({
      description: 'some updated description',
      complete: true,
    });
    const response = await request
      .patch(`/api/todos/${todo.id}`)
      .send(updatePayload);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      id: todo.id,
      complete: updatePayload.complete,
      description: updatePayload.description,
      createdAt: todo.createdAt,
      modifiedAt: expect.any(String),
    });
    expect(+new Date(response.body.modifiedAt)).toBeGreaterThan(
      +new Date(todo.modifiedAt)
    );
  });
});
