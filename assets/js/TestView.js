define(function (require) {
  const Backbone = require('Backbone')
  const ProtoMessageModel = require('./ProtoMessageModel')
  const _ = require('_');


  const TestView = Backbone.View.extend({

    message: {},

    initialize: function () {
      let _this = this;
      this.model = new ProtoMessageModel;
      this.initWebSockets()

      this.listenToOnce(this.model, 'change:registerMessageSourceResponse', function (model, value, options) {
        const message = _this.model.createGetDownDevicesRequest()
        _this.sendWebSocketMessage(message);
      })
    },

    initWebSockets: function () {
      let _this = this;

      const socket = new WebSocket('ws://13.52.16.27:8001/')
      socket.binaryType = 'arraybuffer';

      socket.onmessage = function (event) {
        let decoded = _this.model.Message.decode(new Uint8Array(event.data));
        console.log(`DECODED: ${JSON.stringify(decoded)}`);
        _this.model.set(decoded.toJSON())
      }

      socket.onopen = function () {
        console.log('WebSocket Client Connected')
        if (socket.readyState === socket.OPEN) {
          const message = _this.model.createRegisterMessageSourceRequest()
          _this.sendWebSocketMessage(message)
        }
      }

      socket.onclose = function(event) {
        console.log(`CONNECTION CLOSED CODE: ${event.code} Reason: ${event.reason}`)
      }

      socket.onerror = function (error) {
        console.log(`Error: ${error.message}`)
      }

      this.socket = socket;
    },


    sendWebSocketMessage: function (message) {
      const buffer = this.model.Message.encode(message).finish()
      this.socket.send(buffer)

      console.log(`ENCODED: ${JSON.stringify(message)}`);
      console.log('================================================')
    },

    render: function () {
      this.$el.html(`<div><h2>Test message!</h2></div>`)
    }
  });

  return TestView;
})