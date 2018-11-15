const express = require('express')
const compression = require('compression')
const path = require('path')
const WebSocketServer = require('websocket').server
const Protobuf = require('protobufjs')

const Root = Protobuf.Root,
  Type  = Protobuf.Type,
  Field = Protobuf.Field

const app = new express()
const http = require('http').Server(app)

app.use(compression())
app.use(express.static(__dirname + '/public'))
app.use('/js', express.static(path.join(__dirname, 'public', 'js')))

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'))


app.get('/', function (req, res) {
  res.render('index')
});


http.listen(3000, function() {
  console.log(`${new Date()} Server is listening on port 3000`);
})

const wsServer = new WebSocketServer({
  httpServer: http,
  autoAcceptConnections: false
})

wsServer.on('request', function(request) {
  const connection = request.accept('echo-protocol', request.origin)

  console.log(`${(new Date())} Connection accepted.`)
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      console.log(`Received Message: ${message.utf8Data}`)
      connection.sendUTF(message.utf8Data)
    } else if (message.type === 'binary') {
      console.log(`Received Binary Message of ${message.binaryData.length} bytes`)
      console.log(`Binary data: ${message.binaryData}`)

      let AwesomeMessage = new Type('AwesomeMessage').add(new Field('test_message', 1, 'string'))
      let root = new Root().define('awesomepackage').add(AwesomeMessage)

      let decoded = AwesomeMessage.decode(message.binaryData);
      console.log(`decoded = ${JSON.stringify(decoded)}`);
      console.log('=============================================')

      connection.sendBytes(message.binaryData)
    }
  });
  connection.on('close', function(reasonCode, description) {
    console.log(`${new Date()} Peer ${connection.remoteAddress} disconnected.`);
  });
});


exports.app = app