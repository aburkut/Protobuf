const express = require('express')
const compression = require('compression')
const path = require('path')
const WebSocketServer = require('websocket').server
const fs = require('fs')
const Protobuf = require('protobufjs')

require.extensions['.proto'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const messengerProto = require('./proto/messenger.proto')

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
  console.log(`Server is listening on port 3000 - ${new Date()} `);
})

const wsServer = new WebSocketServer({
  httpServer: http,
  autoAcceptConnections: false
})

wsServer.on('request', function(request) {

  const connection = request.accept('echo-protocol', request.origin)

  console.log(`Connection accepted - ${(new Date())}`)

  connection.on('message', function(message) {
    if (message.type === 'binary') {
      console.log(`Received Binary Message of ${message.binaryData.length} bytes`)
      console.log(`Binary data: ${message.binaryData}`)

      const parsed = Protobuf.parse(messengerProto).root
      const Message = parsed.lookupType('msg_1.Message')
      const decoded = Message.decode(message.binaryData)

      console.log(`DECODED: ${JSON.stringify(decoded)}`);
      console.log('=============================================')

      console.log('DECODED: ', decoded)
      const buffer = Message.encode(decoded).finish()

      buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.length)
      connection.sendBytes(buffer)
    }
  })

  connection.on('close', function(reasonCode, description) {
    console.log(`${new Date()} Peer ${connection.remoteAddress} disconnected.`);
  })

});

exports.app = app