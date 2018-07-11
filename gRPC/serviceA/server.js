const grpc = require('grpc');
const Hapi = require('hapi');
const Good = require('good');
// const Boom = require('boom');


const protoPath = `${__dirname}/../serviceB/serviceB.proto`;
const proto = grpc.load(protoPath);

const client = new proto.SampleDataService('localhost:8001', grpc.credentials.createInsecure());
const getDataViagRPC = async () => new Promise((resolve, reject) => {
  client.getSampleData({}, (err, response) => {
    if (!response.err) {
      resolve(response);
    } else {
      reject(err);
    }
  });
});

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
    const result = await getDataViagRPC();
    console.log(result);
    return h.response(result);
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
