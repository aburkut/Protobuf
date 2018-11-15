define(function (require) {
  const Backbone = require('Backbone')
  const Protobuf = require('Protobuf')


  const TestView = Backbone.View.extend({

    initialize: function () {
      const _this = this;
      const Root = Protobuf.Root,
        Type  = Protobuf.Type,
        Field = Protobuf.Field

      let AwesomeMessage = new Type('AwesomeMessage').add(new Field('test_message', 1, 'string'))
      let root = new Root().define('awesomepackage').add(AwesomeMessage)

      const socket = new WebSocket('ws://localhost:3000/', 'echo-protocol')

      socket.onopen = function() {
        console.log('WebSocket Client Connected')

        function sendMessage() {
          if (socket.readyState === socket.OPEN) {
            let payload = { test_message: _this.generateRandomString() }
            let message = AwesomeMessage.create(payload)
            let buffer = AwesomeMessage.encode(message).finish()

            socket.send(buffer)
            console.log(`message = ${JSON.stringify(message)}`);
            console.log(`buffer = ${Array.prototype.toString.call(buffer)}`);
            console.log('==============================================')
            setTimeout(sendMessage, 1000)
          }
        }
        sendMessage()
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
    },

    generateRandomString: function () {
      let string = "";
      const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (let i = 0; i < 5; i++)
        string += possible.charAt(Math.floor(Math.random() * possible.length));

      return string;
    },

    render: function () {
      this.$el.html(`<div><h2>Test message!</h2></div>`)
    }
  });

  return TestView;
})