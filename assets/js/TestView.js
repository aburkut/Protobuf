define(function (require) {
  const Backbone = require('Backbone')
  const Protobuf = require('Protobuf')


  const TestView = Backbone.View.extend({

    initialize: function () {
      const Root = Protobuf.Root,
        Type  = Protobuf.Type,
        Field = Protobuf.Field

      let AwesomeMessage = new Type('AwesomeMessage').add(new Field('test_message', 1, 'string'))
      let root = new Root().define('awesomepackage').add(AwesomeMessage)


      const payload = { test_message: '123' }
      let message = AwesomeMessage.create(payload)
      const buffer = AwesomeMessage.encode(message).finish()

      const socket = new WebSocket('ws://localhost:3000/', 'echo-protocol')

      socket.onopen = function() {
        console.log('WebSocket Client Connected')

        console.log(`buffer = ${Array.prototype.toString.call(buffer)}`);
        socket.send(buffer)
      };

      socket.onclose = function(event) {
        if (event.wasClean) {
          console.log('echo-protocol Client Closed clean')
        } else {
          console.log('Connection aborted')
        }
        console.log(`CODE: ${event.code} Reason: ${event.reason}`)
      };

      socket.onmessage = function(event) {
        console.log(`Data received: ${event.data}`)
        console.log(event)
      };

      socket.onerror = function(error) {
        console.log(`Error: ${error.message}`)
      };


      // console.log('BUFFER: ', buffer)
      // console.log('DECODED: ', decoded)
    },

    render: function () {
      this.$el.html(`<div><h2>Test message!</h2></div>`)
    }
  });

  return TestView;
})