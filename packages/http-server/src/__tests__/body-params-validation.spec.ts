import { createLogger } from '@stoplight/prism-core';
import { IHttpOperation } from '@stoplight/types';
import fetch, { RequestInit } from 'node-fetch';
import { createServer } from '../';
import { ThenArg } from '../types';
import * as faker from '@faker-js/faker/locale/en';

const logger = createLogger('TEST', { enabled: false });

async function instantiatePrism(operations: IHttpOperation[]) {
  const server = createServer(operations, {
    components: { logger },
    cors: true,
    config: {
      checkSecurity: true,
      validateRequest: true,
      validateResponse: true,
      mock: { dynamic: false },
      errors: false,
      upstreamProxy: undefined,
      isProxy: false,
    },
  });

  // be careful with selecting the port: it can't be the same in different suite because test suites run in parallel
  const address = await server.listen(30000, '127.0.0.1');

  return {
    close: server.close.bind(server),
    address,
  };
}

describe('body params validation', () => {
  let server: ThenArg<ReturnType<typeof instantiatePrism>>;

  afterEach(() => server.close());

  function makeRequest(url: string, init?: RequestInit) {
    return fetch(new URL(url, server.address), init);
  }

  describe('http operation with body param', () => {
    beforeEach(async () => {
      server = await instantiatePrism([
        {
          id: '?http-operation-id?',
          method: 'post',
          path: '/json-body-no-request-content-type',
          responses: [
            {
              id: faker.random.word(),
              code: '200',
              headers: [],
              contents: [
                {
                  id: faker.random.word(),
                  mediaType: 'text/plain',
                  schema: {
                    type: 'string',
                    $schema: 'http://json-schema.org/draft-07/schema#',
                  },
                  examples: [],
                  encodings: [],
                },
              ],
            },
          ],
          servers: [],
          request: {
            body: {
              id: faker.random.word(),
              contents: [
                {
                  id: faker.random.word(),
                  mediaType: '',
                  schema: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'integer',
                        minimum: -9223372036854776000,
                        maximum: 9223372036854776000,
                      },
                    },
                    $schema: 'http://json-schema.org/draft-07/schema#',
                  },
                  examples: [],
                  encodings: [],
                },
              ],
            },
            headers: [],
            query: [],
            cookie: [],
            path: [],
          },
          tags: [],
          security: [],
        },
        {
          id: '?http-operation-id?',
          method: 'post',
          path: '/json-body-optional',
          responses: [
            {
              id: faker.random.word(),
              code: '200',
              headers: [],
              contents: [
                {
                  id: faker.random.word(),
                  mediaType: 'text/plain',
                  schema: {
                    type: 'string',
                    $schema: 'http://json-schema.org/draft-07/schema#',
                  },
                  examples: [],
                  encodings: [],
                },
              ],
            },
          ],
          servers: [],
          request: {
            body: {
              id: faker.random.word(),
              required: false,
              contents: [
                {
                  id: faker.random.word(),
                  mediaType: 'application/json',
                  schema: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'integer',
                        minimum: -9223372036854776000,
                        maximum: 9223372036854776000,
                      },
                    },
                    $schema: 'http://json-schema.org/draft-07/schema#',
                  },
                  examples: [],
                  encodings: [],
                },
              ],
            },
            headers: [],
            query: [],
            cookie: [],
            path: [],
          },
          tags: [],
          security: [],
        },
        {
          id: '?http-operation-id?',
          method: 'post',
          path: '/json-body-required',
          responses: [
            {
              id: faker.random.word(),
              code: '200',
              headers: [],
              contents: [
                {
                  id: faker.random.word(),
                  mediaType: 'text/plain',
                  schema: {
                    type: 'string',
                    $schema: 'http://json-schema.org/draft-07/schema#',
                  },
                  examples: [],
                  encodings: [],
                },
              ],
            },
          ],
          servers: [],
          request: {
            body: {
              id: faker.random.word(),
              required: true,
              contents: [
                {
                  id: faker.random.word(),
                  mediaType: 'application/json',
                  schema: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'integer',
                        minimum: -9223372036854776000,
                        maximum: 9223372036854776000,
                      },
                      status: {
                        type: 'string',
                        enum: ['placed', 'approved', 'delivered'],
                      },
                    },
                    $schema: 'http://json-schema.org/draft-07/schema#',
                  },
                  examples: [],
                  encodings: [],
                },
              ],
            },
            headers: [],
            query: [],
            cookie: [],
            path: [],
          },
          tags: [],
          security: [],
        },
        {
          id: '?http-operation-id?',
          method: 'post',
          path: '/json-body-property-required',
          responses: [
            {
              id: faker.random.word(),
              code: '200',
              headers: [],
              contents: [
                {
                  id: faker.random.word(),
                  mediaType: 'text/plain',
                  schema: {
                    type: 'string',
                    $schema: 'http://json-schema.org/draft-07/schema#',
                  },
                  examples: [],
                  encodings: [],
                },
              ],
            },
          ],
          servers: [],
          request: {
            body: {
              id: faker.random.word(),
              contents: [
                {
                  id: faker.random.word(),
                  mediaType: 'application/json',
                  schema: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'integer',
                        minimum: -9223372036854776000,
                        maximum: 9223372036854776000,
                      },
                    },
                    required: ['id'],
                    $schema: 'http://json-schema.org/draft-07/schema#',
                  },
                  examples: [],
                  encodings: [],
                },
              ],
            },
            headers: [],
            query: [],
            cookie: [],
            path: [],
          },
          tags: [],
          security: [],
        },
        {
          id: '?http-operation-id?',
          method: 'post',
          path: '/json-body-property-required-with-custom-415',
          responses: [
            {
              id: faker.random.word(),
              code: '415',
              headers: [],
              contents: [
                {
                  id: faker.random.word(),
                  mediaType: 'application/json',
                  schema: {
                    type: 'object',
                    properties: {
                      type: {
                        type: 'string',
                      },
                    },
                  },
                  examples: [
                    {
                      id: faker.random.word(),
                      key: 'test',
                      value: { type: 'foo' },
                    },
                  ],
                  encodings: [],
                },
              ],
            },
          ],
          servers: [],
          request: {
            body: {
              id: faker.random.word(),
              contents: [
                {
                  id: faker.random.word(),
                  mediaType: 'application/json',
                  schema: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'integer',
                        minimum: -9223372036854776000,
                        maximum: 9223372036854776000,
                      },
                    },
                    required: ['id'],
                    $schema: 'http://json-schema.org/draft-07/schema#',
                  },
                  examples: [],
                  encodings: [],
                },
              ],
            },
            headers: [],
            query: [],
            cookie: [],
            path: [],
          },
          tags: [],
          security: [],
        },
        {
          id: '?http-operation-id?',
          method: 'post',
          path: '/json-body-circular-property-required',
          responses: [
            {
              id: faker.random.word(),
              code: '200',
              headers: [],
              contents: [
                {
                  id: faker.random.word(),
                  mediaType: 'text/plain',
                  schema: {
                    type: 'string',
                    $schema: 'http://json-schema.org/draft-07/schema#',
                  },
                  examples: [],
                  encodings: [],
                },
              ],
            },
          ],
          servers: [],
          request: {
            body: {
              id: faker.random.word(),
              contents: [
                {
                  id: faker.random.word(),
                  mediaType: 'application/json',
                  schema: {
                    $ref: '#/__bundled__/schemas',
                  },
                  examples: [],
                  encodings: [],
                },
              ],
            },
            headers: [],
            query: [],
            cookie: [],
            path: [],
          },
          tags: [],
          security: [],
          // @ts-ignore
          ['__bundled__']: {
            schemas: {
              $schema: 'http://json-schema.org/draft-07/schema#',
              type: 'object',
              required: ['id'],
              properties: {
                id: {
                  type: 'integer',
                  minimum: -9223372036854776000,
                  maximum: 9223372036854776000,
                },
                self: {
                  $ref: '#/__bundled__/schemas',
                },
              },
            },
          },
        },
        {
          id: '?http-operation-id?',
          method: 'get',
          path: '/empty-body',
          responses: [
            {
              id: faker.random.word(),
              code: '200',
              headers: [],
              contents: [
                {
                  id: faker.random.word(),
                  mediaType: 'text/plain',
                  schema: {
                    type: 'string',
                    $schema: 'http://json-schema.org/draft-07/schema#',
                  },
                  examples: [],
                  encodings: [],
                },
              ],
            },
          ],
          servers: [],
          request: {
            headers: [],
            query: [],
            cookie: [],
            path: [],
          },
          tags: [],
          security: [],
        },
      ]);
    });

    describe('operation with no request content type defined', () => {
      describe('property type invalid', () => {
        test('returns 422 & error message', async () => {
          const response = await makeRequest('/json-body-no-request-content-type', {
            method: 'POST',
            body: JSON.stringify({ id: 'string' }),
            headers: { 'content-type': 'application/json' },
          });

          expect(response.status).toBe(422);
          return expect(response.json()).resolves.toMatchObject({
            validation: [
              {
                code: 'type',
                location: ['body', 'id'],
                message: 'Request body property id must be integer',
                severity: 'Error',
              },
            ],
          });
        });
      });
    });

    describe('operation with required property', () => {
      describe('when property not provided', () => {
        test('returns 422 & error message', async () => {
          const response = await makeRequest('/json-body-property-required', {
            method: 'POST',
            body: '{}',
            headers: { 'content-type': 'application/json' },
          });

          expect(response.status).toBe(422);
          return expect(response.json()).resolves.toMatchObject({
            validation: [
              { code: 'required', message: "Request body must have required property 'id'", severity: 'Error' },
            ],
          });
        });
      });
    });

    describe('operation with circular required property', () => {
      describe('when property not provided', () => {
        test('returns 422 & error message', async () => {
          const response = await makeRequest('/json-body-circular-property-required', {
            method: 'POST',
            body: JSON.stringify({
              id: 123,
              self: {
                // missing id property here
              },
            }),
            headers: { 'content-type': 'application/json' },
          });

          expect(response.status).toBe(422);
          return expect(response.json()).resolves.toMatchObject({
            validation: [
              {
                code: 'required',
                location: ['body', 'self'],
                message: "Request body property self must have required property 'id'",
                severity: 'Error',
              },
            ],
          });
        });
      });
    });

    describe('operation with optional body', () => {
      describe('when no body provided', () => {
        test('returns 200', async () => {
          const response = await makeRequest('/json-body-optional', { method: 'POST' });
          expect(response.status).toBe(200);
        });

        describe('and no content is specified', () => {
          test('returns 200 with no body', async () => {
            const response = await makeRequest('/empty-body', {
              method: 'GET',
              headers: { 'content-type': 'application/json' },
            });
            expect(response.status).toBe(200);
          });
          test('returns 200 with empty plain body', async () => {
            const response = await makeRequest('/empty-body', {
              method: 'GET',
              headers: { 'content-type': 'text/plain', 'content-length': '0' },
            });
            expect(response.status).toBe(200);
          });
          test('returns 200 with empty JSON body', async () => {
            const response = await makeRequest('/empty-body', {
              method: 'GET',
              headers: { 'content-type': 'application/json', 'content-length': '0' },
            });
            expect(response.status).toBe(200);
          });
        });
      });

      describe('when body with unsupported content-type is used', () => {
        test('returns 415', async () => {
          const response = await makeRequest('/json-body-optional', {
            method: 'POST',
            headers: { 'content-type': 'application/xml' },
            body: 'some xml',
          });
          expect(response.status).toBe(415);
        });
      });
    });

    describe('operation with custom 415', () => {
      it('returns custom 415', async () => {
        const response = await makeRequest('/json-body-property-required-with-custom-415', {
          method: 'POST',
          headers: {
            'content-type': 'application/csv',
          },
          body: 'type,name\nfoo,foobar',
        });
        expect(response.status).toBe(415);
        await expect(response.json()).resolves.toMatchObject({ type: 'foo' });
      });
    });

    describe('operation with required body', () => {
      describe('when no body provided', () => {
        test('returns 422 & error message', async () => {
          const response = await makeRequest('/json-body-required', { method: 'POST' });
          expect(response.status).toBe(422);
          return expect(response.json()).resolves.toMatchObject({
            validation: [{ code: 'required', message: 'Body parameter is required', severity: 'Error' }],
          });
        });
      });

      describe('when body provided', () => {
        describe('and content type has different content-type suffix', () => {
          test('returns 422 & error message', async () => {
            const response = await makeRequest('/json-body-required', {
              method: 'POST',
              headers: { 'content-type': 'application/vnd1+json' },
              body: JSON.stringify({ id: 100, status: 'placed' }),
            });

            expect(response.status).toBe(200);
          });
        });

        describe('and property type invalid', () => {
          test('returns 422 & error message', async () => {
            const response = await makeRequest('/json-body-required', {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ id: 'string' }),
            });

            expect(response.status).toBe(422);
            return expect(response.json()).resolves.toMatchObject({
              validation: [
                {
                  code: 'type',
                  location: ['body', 'id'],
                  message: 'Request body property id must be integer',
                  severity: 'Error',
                },
              ],
            });
          });
        });

        describe('and property not one of enum', () => {
          test('returns 422 & error message', async () => {
            const response = await makeRequest('/json-body-required', {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ status: 'string' }),
            });

            expect(response.status).toBe(422);
            return expect(response.json()).resolves.toMatchObject({
              validation: [
                {
                  code: 'enum',
                  location: ['body', 'status'],
                  message:
                    'Request body property status must be equal to one of the allowed values: placed, approved, delivered',
                  severity: 'Error',
                },
              ],
            });
          });
        });

        describe('and size bigger than 10MB', () => {
          test('returns 422', async () => {
            const response = await makeRequest('/json-body-required', {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: 'A'.repeat(1024 * 1024 * 500 + 1),
            });

            expect(response.status).toBe(413);
            return expect(response.json()).resolves.toMatchObject({
              error: {
                code: 'request_entity_too_large',
                message: 'Body exceeded 10mb limit',
              },
            });
          });
        });
      });
    });
  });

  describe('http operation with form data param', () => {
    beforeEach(async () => {
      server = await instantiatePrism([
        {
          id: '?http-operation-id?',
          method: 'post',
          path: '/path',
          responses: [
            {
              id: faker.random.word(),
              code: '200',
              headers: [],
              contents: [
                {
                  id: faker.random.word(),
                  mediaType: 'text/plain',
                  schema: {
                    type: 'string',
                    $schema: 'http://json-schema.org/draft-07/schema#',
                  },
                  examples: [],
                  encodings: [],
                },
              ],
            },
          ],
          servers: [],
          request: {
            body: {
              id: faker.random.word(),
              contents: [
                {
                  id: faker.random.word(),
                  mediaType: 'application/x-www-form-urlencoded',
                  schema: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'integer',
                      },
                      status: {
                        type: 'string',
                        enum: ['open', 'close'],
                      },
                    },
                    required: ['id', 'status'],
                    $schema: 'http://json-schema.org/draft-07/schema#',
                  },
                  examples: [],
                  encodings: [],
                },
              ],
            },
            headers: [],
            query: [],
            cookie: [],
            path: [],
          },
          tags: [],
          security: [],
        },
      ]);
    });

    describe('required parameter not in body', () => {
      test('returns 422', async () => {
        const response = await makeRequest('/path', {
          method: 'POST',
          body: 'success=false',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
        });

        expect(response.status).toBe(422);
        return expect(response.json()).resolves.toMatchObject({
          type: 'https://stoplight.io/prism/errors#UNPROCESSABLE_ENTITY',
          validation: [
            {
              location: ['body'],
              severity: 'Error',
              code: 'required',
              message: "Request body must have required property 'id'",
            },
            {
              location: ['body'],
              severity: 'Error',
              code: 'required',
              message: "Request body must have required property 'status'",
            },
          ],
        });
      });
    });

    describe('parameter does not match enum criteria', () => {
      test('returns 422 & proper validation message', async () => {
        const response = await makeRequest('/path', {
          method: 'POST',
          body: new URLSearchParams({
            id: 'not integer',
            status: 'somerundomestuff',
          }).toString(),
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
        });

        expect(response.status).toBe(422);
        return expect(response.json()).resolves.toMatchObject({
          type: 'https://stoplight.io/prism/errors#UNPROCESSABLE_ENTITY',
          validation: [
            {
              location: ['body', 'id'],
              severity: 'Error',
              code: 'type',
              message: 'Request body property id must be integer',
            },
            {
              location: ['body', 'status'],
              severity: 'Error',
              code: 'enum',
              message: 'Request body property status must be equal to one of the allowed values: open, close',
            },
          ],
        });
      });
    });

    describe('valid parameter provided', () => {
      test('returns 200', async () => {
        const response = await makeRequest('/path', {
          method: 'POST',
          body: new URLSearchParams({
            id: '123',
            status: 'open',
          }).toString(),
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
        });

        expect(response.status).toBe(200);
      });
    });
  });
});
