define(function (require) {
  const Backbone = require('Backbone');
  const Protobuf = require('Protobuf')
  const proto = require('text!../proto/messenger3.proto')


  const ProtoMessageModel = Backbone.Model.extend({

    defaults: {
      registerMessageSourceResponse: {}
    },

    initialize: function () {
      this.parsed = Protobuf.parse(proto).root
      this.Message = this.parsed.lookupType('msg_1.Message')
      this.ServiceType = this.parsed.lookupEnum('msg_1.ServiceType')
      this.DestinationOption = this.parsed.lookupEnum('msg_1.DestinationOption');
    },

    createRegisterMessageSourceRequest: function () {
      const payload = {
        id: 1,
        src: {
          id: 0,
          service: this.ServiceType.values.WEB_CLIENT,
        },
        dst: {
          id: 0,
          service: this.ServiceType.values.MESSAGE_BROKER,
        },
        registerMessageSourceRequest: {}
      }

      const errMsg = this.Message.verify(payload)

      if(errMsg) {
        throw new Error(errMsg);
        return
      }

      return this.Message.create(payload)
    },

    createGetDownDevicesRequest: function () {
      const payload = {
        id: this.get('id'),
        src: {
          id: this.get('registerMessageSourceResponse').destinationId,
          service: this.ServiceType.values.WEB_CLIENT
        },
        dst: {
          option: this.DestinationOption.values.TO_ONE,
          service: this.ServiceType.values.WEB_SERVER//this.ServiceType.values.ICMP_MONITORING
        },
        downDevicesRequest: {}
      }

      const errMsg = this.Message.verify(payload)

      if(errMsg) {
        throw new Error(errMsg)
      }

      return this.Message.create(payload)
    }
  });


  return ProtoMessageModel;

});