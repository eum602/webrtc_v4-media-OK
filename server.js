/*
req.io.join(room) - The client for the request joins room.
req.io.leave(room) - The client for the request leaves room.
req.io.room(room).broadcast(event, data) - Broadcast to all client in the room except for the current one.
app.io.room(room).broadcast(event, data) - Broadcast to all clients in the room.
*/
var express = require("express.io");
var app = express();
app.http().io();
var PORT = 3001;
console.log('server started at',PORT);

app.use(express.static(__dirname + '/public'))//usando esta middleware 
//para acceder a la carpeta public
app.get('/',(req,res)=>{
   res.render('index.ejs')
  //res.send('hello world');
})

app.io.route('ready',function(req){//code when someone new enters into the platform
    //es muy importante que el nombre "route" sea exactamente asi llamado dentro del html file-
    req.io.join(req.data.chat_room);
    req.io.join(req.data.signal_room);
    req.io.join(req.data.files_room);
    app.io.room(req.data.chat_room).broadcast('announce',{//announce
        message: 'New Client in the ' + req.data.chat_room + ' room.'     
    })
    //req.io.emit('talk', { //agregando un popup --->talk
    //    message: 'io event from an io route on the server'
    //})
})
/*
app.io.route('send',function(req){
    app.io.room(req.data.room).broadcast('message',{//si empieza con app.io entonces
        //el broadcast se da hacia todos los nodos pero si empezara con req.io entonces
        //el broadcast se haria hacia todos los nodos pero menos al que llama a este route.
        message:req.data.message,
        author:req.data.author
    })
})
*/
app.io.route('signal',function(req){
    //note the use of req here for broadcasting so only the sender doesn't receive
    //their own messages
    req.io.room(req.data.room).broadcast('signaling_message',{
        type:req.data.type,
        message:req.data.message
    })
})
/*
app.io.route('files',function(req){
    req.io.room(req.data.room).broadcast('files',{
        filename:req.data.filename,
        filesize:req.data.filesize
    })
})
*/
app.listen(PORT)