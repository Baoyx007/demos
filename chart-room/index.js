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
app.use('/src', express.static(path.join(__dirname, '/src')))
app.use('/static', express.static(path.join(__dirname, '/node_modules')))


let users = 0
let userArray = []
let repetName = {}

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

    socket.on('add user', (username)=> {
        if (userArray.indexOf(username) > -1) {
            // console.log(repetName.username)
            repetName.username = repetName.username ? repetName.username + 1 : 1
            username = username + repetName.username
        }
        socket.name = username
        ++users
        userArray.push(username)
        console.log(`add user ${username} - ${users}`)

        socket.emit('login!', {
            userNumbers: users,
            userArray: userArray
        })

        socket.broadcast.emit('user joined', {
            username: username,
            userNumbers: users
            // userArray:userArray
        })
    })

    socket.on('typing', ()=> {
        socket.broadcast.emit('typing', {
            username: socket.name
        })
    })

    socket.on('stop typing', ()=> {
        socket.broadcast.emit('stop typing', {
            username: socket.name
        })
    })

    socket.on('disconnect', function () {
        users = users > 0 ? users - 1 : 0
        let removeIndex = userArray.indexOf(socket.name)
        if (removeIndex && removeIndex > -1) {
            userArray.splice(removeIndex, 1)
        }
        console.log('left user:' + userArray.join(', '))
        socket.broadcast.emit('user left', {
            username: socket.name,
            userNumbers: users
            // userArray:userArray
        })
        console.log('user disconnected ' + socket.name);
    })
})

