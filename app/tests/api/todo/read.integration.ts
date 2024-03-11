import supertest, { SuperTest, Test as STest } from 'supertest';
import { v4 as uuid } from 'uuid';

import { ToDo } from '../../../src/types';

describe('Read ToDo', () => {
  let request: SuperTest<STest>;
  let todoOne: ToDo;
  let todoTwo: ToDo;

  const payload = ({
    description = 'some description',
    complete = false,
  } = {}) => ({ description, complete });

  beforeAll(async () => {
    request = supertest('http://0.0.0.0:3001/dev');

    const [createOne, createTwo] = await Promise.all([
      request.post(`/api/todos`).send(payload()),
      request.post(`/api/todos`).send(payload()),
    ]);
    todoOne = createOne.body;
    todoTwo = createTwo.body;
  });

  afterAll(async () => {
    // perform cleanup
    await Promise.all([
      request.delete(`/api/todos/${todoOne.id}`),
      request.delete(`/api/todos/${todoTwo.id}`),
    ]);
  });

  describe('GET /todos', () => {
    it('should return a 200 and all the todos', async () => {
      const response = await request.get('/api/todos');

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(expect.arrayContaining([todoOne, todoTwo]));
    });
  });

  describe('GET /todo/:id', () => {
    it('should return a 200 and the specified todo', async () => {
      const response = await request.get(`/api/todos/${todoOne.id}`);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(todoOne);
    });
  });
});
