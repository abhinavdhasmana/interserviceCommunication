const grpc = require('grpc');

const proto = grpc.load('serviceB.proto');
const server = new grpc.Server();

server.addProtoService(proto.SampleDataService.service, {
  getSampleData(call, callback) {
    setTimeout(() => {
      callback(null, {
        id: 1,
        name: 'Abhinav Dhasmana',
        enjoy_coding: true,
      });
    }, 10);
  },
});

server.bind('0.0.0.0:8001', grpc.ServerCredentials.createInsecure());

server.start();
console.log('grpc server is running');
