/**
 * Created by haven on 16/8/17.
 */
let express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 6888;
var path = require('path');


// app.get('/', function (req, res) {
//     console.log('request / from ' + req.address)
//     res.sendFile(__dirname + '/index.html');
// });

http.listen(port, function () {
    console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname,'/src')))


let users = 0

io.on('connection', function (socket) {


    // send new message
    socket.on('new message', (msg)=> {
        console.log(`chat message: ${msg}`)
        socket.broadcast.emit('new message', {
            username: socket.name,
            message: msg
        })
        io.emit('chat message', msg)
    })

    socket.on('add user', (username)=>{
        socket.username=username
        users++
        console.log(`add user ${username}`)

        socket.emit('login!',{
            userNumbers:users
        })

        socket.broadcast.emit('user joined', {
            username: socket.name,
            userNumbers:users
        })
    })

    socket.on('typing', ()=>{
        socket.broadcast.emit('typing', {
            username: socket.name
        })
    })

    socket.on('stop typing', ()=>{
        socket.broadcast.emit('stop typing', {
            username: socket.name
        })
    })

    socket.on('disconnect', function () {
        users--
        socket.broadcast.emit('user left',{
            username: socket.name,
            userNumbers:users
        })
        console.log('user disconnected');
    })
})

