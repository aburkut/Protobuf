requirejs.config({
  baseUrl: '/js',
  deps: ['index'],
  waitSeconds: 30,

  paths: {
    Backbone: 'lib/backbone',
    jquery: 'lib/jquery',
    _: 'lib/underscore',
    Protobuf: 'lib/protobuf',
    Long: 'lib/long',
    json: 'lib/json',
    text: 'lib/text',
    w3cwebsocket: 'lib/W3CWebSocket',
    WebSocketClient: 'lib/WebSocketClient',
    'typedarray-to-buffer': 'typedarray-to-buffer',
    'is-typedarray': 'lib/is-typedarray/index'
  },

  map: {
    '*': {
      underscore: '_',
      long: 'Long',
      backbone: 'Backbone',
      jQuery: 'jquery'
    }
  },

  shim: {
    _: {
      exports: '_'
    },
    Backbone: {
      deps: ['jquery', '_'],
      exports: 'Backbone'
    },
    w3cwebsocket: {
      deps: ['WebSocketClient', 'typedarray-to-buffer', 'yaeti'],
      exports: 'W3CWebSocket'
    },
    'typedarray-to-buffer': {
      deps: ['is-typedarray']
    }
  }
});