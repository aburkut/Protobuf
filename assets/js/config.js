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
    text: 'lib/text',
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
  }
});