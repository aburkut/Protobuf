define(function (require) {
  const Backbone = require('Backbone')
  const Protobuf = require('Protobuf')
  const proto = require('text!../proto/messenger.proto')


  const TestView = Backbone.View.extend({

    initialize: function () {
      const _this = this;

      const parsed = Protobuf.parse(proto).root
      const Message = parsed.lookupType('msg_1.Message')
      const ServiceType = parsed.lookupEnum('msg_1.ServiceType')

      const socket = new WebSocket('ws://localhost:3000/', 'echo-protocol')
      socket.binaryType = 'arraybuffer';

      socket.onopen = function() {
        console.log('WebSocket Client Connected')

        function sendMessage() {
          if (socket.readyState === socket.OPEN) {
            const payload = {
              id: 1,
              src: {
                id: 1,
                service: ServiceType.values.WEB_CLIENT,
              },
              dst: {
                id: 1,
                service: ServiceType.values.AWS_MONITORING,
              },
              emailNotification: {
                id: 123,
                subject: 'Test',
                body: 'Test Test Test',
                to: ['test@test.test', 'test1@test.test']
              }
            }

            const errMsg = Message.verify(payload)

            console.log('ERR MSG: ', errMsg)

            let message = Message.create(payload)
            let buffer = Message.encode(message).finish()

            socket.send(buffer)

            console.log(`MESSAGE: ${JSON.stringify(message)}`);
            console.log(`BEUFFER: ${Array.prototype.toString.call(buffer)}`);
            console.log('================================================')
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
        const decoded = Message.decode(new Uint8Array(event.data))
        console.log(`RECEIVED DECODED JSON: ${JSON.stringify(decoded)}`);

      };

      socket.onerror = function(error) {
        console.log(`Error: ${error.message}`)
      };
    },

    render: function () {
      this.$el.html(`<div><h2>Test message!</h2></div>`)
    }
  });

  return TestView;
})