const Hapi = require('hapi');
const Good = require('good');
const Boom = require('boom');
const Http2 = require('http2'); // eslint-disable-line
const fs = require('fs');

const options = {
  reporters: {
    myConsoleReporter: [
      {
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{ log: '*', response: '*' }],
      }, {
        module: 'good-console',
      }, 'stdout',
    ],
  },
};

const serverOptions = {
  allowHTTP1: true,
  key: fs.readFileSync('../certificates/localhost-privatekey.pem'),
  cert: fs.readFileSync('../certificates/localhost-certificate.pem'),
};

const listener = Http2.createSecureServer(serverOptions);

const server = Hapi.server({
  port: 8000,
  tls: true,
  listener,
});

const client = Http2.connect('https://localhost:8001', {
  ca: fs.readFileSync('../certificates/localhost-certificate.pem'),
  rejectUnauthorized: false,
});

server.route({
  method: 'GET',
  path: '/',
  handler: async (request, h) => {
    try {
      const idPromise = new Promise((resolve) => {
        const req = client.request({ ':path': '/id' });
        let data = '';
        req.on('data', (chunk) => {
          data += chunk;
        });
        req.on('end', () => resolve(JSON.parse(data)));
      });


      const namePromise = new Promise((resolve) => {
        const req = client.request({ ':path': '/name' });
        let data = '';
        req.on('data', (chunk) => { data += chunk; });
        req.on('end', () => resolve(JSON.parse(data)));
      });

      const passionPromise = new Promise((resolve) => {
        const req = client.request({ ':path': '/passion' });
        let data = '';
        req.on('data', (chunk) => { data += chunk; });
        req.on('end', () => resolve(JSON.parse(data)));
      });


      const allResults = await Promise.all([idPromise, namePromise, passionPromise]);
      const combinedResponse = allResults.reduce(
        (accumulator, currentValue) => ({ ...accumulator, ...currentValue }),
        {},
      );
      return h.response(combinedResponse);
    } catch (err) {
      throw Boom.clientTimeout(err);
    }
  },
});


server.route({
  method: 'GET',
  path: '/data',
  handler: async (request, h) => h.response({ data: 'data' }),
});

const start = async () => {
  try {
    if (!module.parent) {
      await server.register({
        plugin: Good,
        options,
      });
      await server.start();
    }
    console.log('server started');
  } catch (err) {
    console.log('failed to start the server', err);
  }
};

start();
