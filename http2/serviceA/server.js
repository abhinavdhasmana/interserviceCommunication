const Hapi = require('hapi');
const Good = require('good');
const Boom = require('boom');
// const Axios = require('axios');
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
  // host: 'localhost',
  port: 8000,
  tls: true,
  listener,
});

const client = Http2.connect('https://localhost:8001', {
  ca: fs.readFileSync('../certificates/localhost-certificate.pem'),
});

server.route({
  method: 'GET',
  path: '/',
  handler: async (request, h) => {
    try {
      console.log('making request');
      const req = client.request({ ':path': '/' });
      return req.on('end', data => h.response(data));
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
