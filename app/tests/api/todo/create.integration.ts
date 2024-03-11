import supertest, { SuperTest, Test as STest } from 'supertest';

describe('Create ToDo', () => {
  let request: SuperTest<STest>;
  let todoId: string;

  const payload = ({ description = 'some description' } = {}) => ({
    description,
  });

  beforeAll(() => {
    request = supertest('http://0.0.0.0:3001/dev');
  });

  afterAll(async () => {
    // perform cleanup
    await request.delete(`/api/todos/${todoId}`);
  });

  it('should return a 400 and validation errors', async () => {
    const body = { description: null };
    const response = await request.post('/api/todos').send(body);

    todoId = response.body.id;

    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      errors: 'Description must be a string'
    });
  });

  it('should return a 201 and store the information in the db', async () => {
    const body = payload();
    const response = await request.post('/api/todos').send(body);

    todoId = response.body.id;

    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual({
      id: expect.stringMatching(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
      ),
      complete: false,
      description: body.description,
      modifiedAt: expect.any(String),
      createdAt: expect.any(String),
    });
  });
});
