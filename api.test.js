import http from 'http';

import { CLIENT_ERROR, DEFAULT_HEADERS } from 'apisauce';

import { ResponseError } from '../../api/responseError';
import { createAPI } from '../../api/apiCreator';


const httpResponse = (res, statusCode, body) => {
  res.writeHead(statusCode);
  res.write(body);
  res.end();
};

const createServer = (port, mockData) => {
  let attempts = 0;
  const server = http.createServer((req, res) => {
    const url = req.url;
    switch (url) {
    case '/bad_request':
      httpResponse(res, 400, JSON.stringify({ errorMessage: 'bad request' }));

      return;
    case '/bad_request_retry':
      if (attempts === 3) {
        attempts = 0;
        httpResponse(res, 200, JSON.stringify({ got: mockData }));
      } else {
        ++attempts;
        httpResponse(res, 400, JSON.stringify({ errorMessage: 'bad request' }));
      }

      return;
    default:
      httpResponse(res, 200, JSON.stringify({ got: mockData }));

      return;
    }
  });
  server.listen(port, 'localhost');

  return server;
};

const mockData = {
  this: {
    is: 'Sparta!',
  },
};
const mockError = new ResponseError('bad request', 400, CLIENT_ERROR);
const baseURL = 'http://localhost:2020';
const api = createAPI({ baseURL });

let server = null;

describe('network manager', () => {
  beforeAll(() => {
    server = createServer(2020, mockData);
  });
  afterAll(() => {
    server.close();
  });

  it('configures api correctly', () => {
    const testApi = createAPI({ baseURL });
    expect(testApi.instance.axiosInstance.defaults.baseURL).toStrictEqual(baseURL);
  });

  it('set headers correctly', () => {
    const header = { 'X-Warrior': 'Leonid' };
    api.setHeaders(header);
    expect(api.instance.headers).toStrictEqual({ ...header, ...DEFAULT_HEADERS });
  });

  describe('get method', () => {
    it('handle success', async () => {
      expect.assertions(1);

      await expect(api.get('/ok')).resolves.toStrictEqual({ got: mockData });
    });

    it('handle retry successfully', async () => {
      await expect(api.get('/bad_request_retry')).resolves.toStrictEqual({ got: mockData });
    });

    it('throw error with changed retry value', async () => {
      let err;

      try {
        await api.get('/bad_request_retry', {}, { 'axios-retry': { retries: 2 } });
      } catch (e) {
        err = e;
      }

      expect(err).toStrictEqual(mockError);
      expect(err.status).toStrictEqual(mockError.status);
      expect(err.problem).toStrictEqual(mockError.problem);
    });

    it('throw error', async () => {
      let err;

      try {
        await api.get('/bad_request');
      } catch (e) {
        err = e;
      }

      expect(err).toStrictEqual(mockError);
      expect(err.status).toStrictEqual(mockError.status);
      expect(err.problem).toStrictEqual(mockError.problem);
    });
  });

  describe('head method', () => {
    it('handle success', async () => {
      expect.assertions(1);

      await expect(api.head('/ok')).resolves.toBeNull();
    });

    it('handle retry successfully', async () => {
      await expect(api.head('/bad_request_retry')).resolves.toBeNull();
    });

    it('throw error with changed retry value', async () => {
      const headError = new ResponseError('unknown network error', 400, CLIENT_ERROR);
      let err;

      try {
        await api.head('/bad_request_retry', {}, { 'axios-retry': { retries: 2 } });
      } catch (e) {
        err = e;
      }

      expect(err).toStrictEqual(headError);
      expect(err.status).toStrictEqual(mockError.status);
      expect(err.problem).toStrictEqual(mockError.problem);
    });

    it('throw error', async () => {
      const headError = new ResponseError('unknown network error', 400, CLIENT_ERROR);
      let err;

      try {
        await api.head('/bad_request');
      } catch (e) {
        err = e;
      }

      expect(err).toStrictEqual(headError);
      expect(err.status).toStrictEqual(headError.status);
      expect(err.problem).toStrictEqual(headError.problem);
    });
  });

  describe('delete method', () => {
    it('handle success', async () => {
      expect.assertions(1);

      await expect(api.del('/ok')).resolves.toStrictEqual({ got: mockData });
    });

    it('handle retry successfully', async () => {
      await expect(api.del('/bad_request_retry')).resolves.toStrictEqual({ got: mockData });
    });

    it('throw error with changed retry value', async () => {
      let err;

      try {
        await api.del('/bad_request_retry', {}, { 'axios-retry': { retries: 2 } });
      } catch (e) {
        err = e;
      }

      expect(err).toStrictEqual(mockError);
      expect(err.status).toStrictEqual(mockError.status);
      expect(err.problem).toStrictEqual(mockError.problem);
    });

    it('throw error', async () => {
      let err;

      try {
        await api.del('/bad_request');
      } catch (e) {
        err = e;
      }

      expect(err).toStrictEqual(mockError);
      expect(err.status).toStrictEqual(mockError.status);
      expect(err.problem).toStrictEqual(mockError.problem);
    });
  });

  describe('post method', () => {
    it('handle success', async () => {
      expect.assertions(1);

      await expect(api.post('/ok')).resolves.toStrictEqual({ got: mockData });
    });

    it('handle retry successfully', async () => {
      await expect(api.post('/bad_request_retry')).resolves.toStrictEqual({ got: mockData });
    });

    it('throw error with changed retry value', async () => {
      let err;

      try {
        await api.post('/bad_request_retry', {}, { 'axios-retry': { retries: 2 } });
      } catch (e) {
        err = e;
      }

      expect(err).toStrictEqual(mockError);
      expect(err.status).toStrictEqual(mockError.status);
      expect(err.problem).toStrictEqual(mockError.problem);
    });

    it('throw error', async () => {
      let err;

      try {
        await api.post('/bad_request');
      } catch (e) {
        err = e;
      }

      expect(err).toStrictEqual(mockError);
      expect(err.status).toStrictEqual(mockError.status);
      expect(err.problem).toStrictEqual(mockError.problem);
    });
  });

  describe('put method', () => {
    it('handle success', async () => {
      expect.assertions(1);

      await expect(api.put('/ok')).resolves.toStrictEqual({ got: mockData });
    });

    it('handle retry successfully', async () => {
      await expect(api.put('/bad_request_retry')).resolves.toStrictEqual({ got: mockData });
    });

    it('throw error with changed retry value', async () => {
      let err;

      try {
        await api.put('/bad_request_retry', {}, { 'axios-retry': { retries: 2 } });
      } catch (e) {
        err = e;
      }

      expect(err).toStrictEqual(mockError);
      expect(err.status).toStrictEqual(mockError.status);
      expect(err.problem).toStrictEqual(mockError.problem);
    });

    it('throw error', async () => {
      let err;

      try {
        await api.put('/bad_request');
      } catch (e) {
        err = e;
      }

      expect(err).toStrictEqual(mockError);
      expect(err.status).toStrictEqual(mockError.status);
      expect(err.problem).toStrictEqual(mockError.problem);
    });
  });

  describe('patch method', () => {
    it('handle success', async () => {
      expect.assertions(1);

      await expect(api.patch('/ok')).resolves.toStrictEqual({ got: mockData });
    });

    it('handle retry successfully', async () => {
      await expect(api.patch('/bad_request_retry')).resolves.toStrictEqual({ got: mockData });
    });

    it('throw error with changed retry value', async () => {
      let err;

      try {
        await api.patch('/bad_request_retry', {}, { 'axios-retry': { retries: 2 } });
      } catch (e) {
        err = e;
      }

      expect(err).toStrictEqual(mockError);
      expect(err.status).toStrictEqual(mockError.status);
      expect(err.problem).toStrictEqual(mockError.problem);
    });

    it('throw error', async () => {
      let err;

      try {
        await api.patch('/bad_request');
      } catch (e) {
        err = e;
      }

      expect(err).toStrictEqual(mockError);
      expect(err.status).toStrictEqual(mockError.status);
      expect(err.problem).toStrictEqual(mockError.problem);
    });
  });
});
