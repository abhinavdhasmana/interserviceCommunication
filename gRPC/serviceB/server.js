const grpc = require('grpc');

const proto = grpc.load('serviceB.proto');
const server = new grpc.Server();


const GetSampleData = (call, callback) => {
  setTimeout(() => {
    callback(null, {
      id: 1,
      name: 'Abhinav Dhasmana',
      enjoys_coding: true,
    });
  }, 10);
};

server.addService(proto.SampleDataService.service, {
  GetSampleData,
});

const port = process.env.PORT;
console.log('port', port);

server.bind(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure());

server.start();
console.log('grpc server is running');
