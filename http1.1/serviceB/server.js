const Hapi = require('hapi');
const Good = require('good');

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

const port = process.env.PORT;
console.log('port', port);

const server = Hapi.server({
  host: '0.0.0.0',
  port,
});

server.route({
  method: 'GET',
  path: '/',
  handler: async (request, h) => {
    const response = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 1,
          name: 'Abhinav Dhasmana',
          enjoys_coding: true,

        });
      }, 10);
    });
    return h.response(response);
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
