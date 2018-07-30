const Hapi = require('hapi');
const Good = require('good');
const Boom = require('boom');
const Axios = require('axios');

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

const server = Hapi.server({
  host: '0.0.0.0',
  port: 8000,
});

server.route({
  method: 'GET',
  path: '/',
  handler: async (request, h) => {
    try {
      const response = await Axios({
        url: 'http://localhost:8001/',
        method: 'GET',
      });
      return h.response(response.data);
    } catch (err) {
      throw Boom.clientTimeout(err);
    }
  },
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
