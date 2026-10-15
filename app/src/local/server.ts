import http from 'http';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import {
  createHandler,
  deleteHandler,
  getAllHandler,
  getHandler,
  patchHandler,
} from '../functions/todo';

// Minimal local stand-in for API Gateway, mirroring the routes defined in
// infra/lib/api.ts. Paths are prefixed with the stage like the deployed API.
const PORT = Number(process.env.PORT ?? 3001);
const STAGE = process.env.STAGE ?? 'dev';

const routes: {
  method: string;
  pattern: RegExp;
  handler: APIGatewayProxyHandler;
}[] = [
  { method: 'POST', pattern: /^\/api\/todos$/, handler: createHandler },
  { method: 'GET', pattern: /^\/api\/todos$/, handler: getAllHandler },
  { method: 'GET', pattern: /^\/api\/todos\/([^/]+)$/, handler: getHandler },
  {
    method: 'PATCH',
    pattern: /^\/api\/todos\/([^/]+)$/,
    handler: patchHandler,
  },
  {
    method: 'DELETE',
    pattern: /^\/api\/todos\/([^/]+)$/,
    handler: deleteHandler,
  },
];

const readBody = (req: http.IncomingMessage): Promise<string> =>
  new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req
      .on('data', (chunk) => chunks.push(chunk))
      .on('end', () => resolve(Buffer.concat(chunks).toString()))
      .on('error', reject);
  });

const send = (res: http.ServerResponse, status: number, body: string) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(body);
};

http
  .createServer(async (req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    const prefix = `/${STAGE}`;
    const path = url.pathname.startsWith(prefix)
      ? url.pathname.slice(prefix.length)
      : null;

    const match = routes
      .filter((route) => route.method === req.method)
      .map((route) => ({ route, found: path?.match(route.pattern) }))
      .find(({ found }) => found);

    if (!path || !match?.found) {
      return send(res, 404, JSON.stringify({ message: 'Not Found' }));
    }

    const body = await readBody(req);
    const event = {
      body: body || null,
      headers: Object.fromEntries(
        Object.entries(req.headers).map(([key, value]) => [
          key,
          Array.isArray(value) ? value.join(',') : value,
        ])
      ),
      httpMethod: req.method,
      path,
      pathParameters: match.found[1] ? { todoId: match.found[1] } : null,
      queryStringParameters: Object.fromEntries(url.searchParams),
    } as unknown as APIGatewayProxyEvent;

    try {
      const result = await match.route.handler(event, {} as never, () => null);
      send(res, result?.statusCode ?? 200, result?.body ?? '');
    } catch (error) {
      console.error(error);
      send(res, 500, JSON.stringify({ message: 'Internal Server Error' }));
    }
  })
  .listen(PORT, '0.0.0.0', () =>
    console.log(`Listening on http://0.0.0.0:${PORT}/${STAGE}`)
  );
