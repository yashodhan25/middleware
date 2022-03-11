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

var port = process.env.PORT || 3000

var users = [];
var users1 = [];
var users2 = [];

io.on('connection', (socket) => {

  socket.on("connected", function (userId) {
    users[userId] = socket.id;
  });

  socket.on("connected_All", function (userId1) {
    users1[userId1] = socket.id;
  });

  socket.on('myMessage', (data) => {
    socket.emit("selfMessage", data);
  });

  socket.on('trigger', (data) => {
    io.to(users1[data]).emit("getHomeData", data);
  });

  socket.on('trigger1', (data) => {
    io.to(users2[data]).emit("alert", data);
  });

  socket.on("connected_All1", function (userId) {
    users2[userId] = socket.id;
  });

  socket.on('sendresponce', async (data)=>{
    io.to(users[data.receiver]).emit("getMessage", data);
    io.to(users1[data.receiver]).emit("getHomeData", data);
  })

  socket.on('sendresponcetogroup', async (data)=>{
    for(var i = 0; i< data.receiver.length; i++){
      io.to(users[data.receiver[i]]).emit("getMessageFromSender", data);
      io.to(users1[data.receiver[i]]).emit("getHomeData", data);
    }
  })

  socket.on('seen', async (email)=>{
    io.to(users[email]).emit("status", email);
  })

  socket.on('disconnect', function() {
  });

});

server.listen(port, ()=> {
    console.log("Started "+port);
});