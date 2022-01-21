const serverurl = 'http://localhost:8080/chat/';

var request = require("request");
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, 
    {
        cors: {
            origin: '*',
        }
    }
);

var users = [];

var useringroups = [];


io.on('connection', (socket) => {

  socket.on("connected", function (userId) {
    users[userId] = socket.id;
  });

  socket.on('sendresponce', async (data)=>{
    io.to(users[data.receiver]).emit("getMessage", data);
  })

  socket.on('sendresponcetogroup', async (data)=>{
    for(var i = 0; i< data.receiver.length; i++){
      io.to(users[data.receiver[i]]).emit("getMessageFromSender", data);
    }
  })

  socket.on('trigger', (data) => {
    request.post({
      url: serverurl+'receive?sender='+data.sender+'&receiver='+data.receiver,
      form: { email:data.sender, other:data.receiver },
      json: true
    }, function(error, response, body){
      socket.emit("mymessage", body);
    }
    );
  });

  socket.on('trigger1', (data) => {
    request.post({
      url: serverurl+'receivechatgroup?receiver='+data.receiver,
      form: { other:data.receiver },
      json: true
    }, function(error, response, body){
      socket.emit("mymessage1", body);
    }
    );
  });

});

server.listen(3000, ()=> {
    console.log("Started 3000");
});