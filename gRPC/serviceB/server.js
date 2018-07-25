const grpc = require('grpc');

const proto = grpc.load('serviceB.proto');
const server = new grpc.Server();


const GetId = (call, callback) => {
  setTimeout(() => {
    callback(null, {
      id: 1,
    });
  }, 10);
};

const GetName = (call, callback) => {
  setTimeout(() => {
    callback(null, {
      name: 'Abhinav Dhasmana',
    });
  }, 10);
};


const GetPassion = (call, callback) => {
  setTimeout(() => {
    callback(null, {
      enjoy_coding: true,
    });
  }, 10);
};

server.addService(proto.SampleDataService.service, {
  GetId,
  GetName,
  GetPassion,
});

// server.addProtoService();

server.bind('0.0.0.0:8001', grpc.ServerCredentials.createInsecure());

server.start();
console.log('grpc server is running');
