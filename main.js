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

});

server.listen(port, ()=> {
    console.log("Started "+port);
});