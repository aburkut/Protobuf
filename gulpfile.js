const gulp = require('gulp')
const del = require('gulp-clean')
const nodemon = require('gulp-nodemon')


const paths = {
  static: 'public',
  javascripts: 'assets/js',
  json: 'assets/json',
  copyNodeModules: [
    'node_modules/requirejs/require.js',
    'node_modules/backbone/backbone.js',
    'node_modules/jquery/dist/jquery.js',
    'node_modules/underscore/underscore.js',
    'node_modules/protobufjs/dist/protobuf.js',
    'node_modules/long/dist/long.js',
    'node_modules/requirejs-plugins/src/json.js',
    'node_modules/requirejs-plugins/lib/text.js',
    // 'node_modules/websocket/lib/W3CWebSocket.js',
    // 'node_modules/websocket/lib/WebSocketClient.js',
    // 'node_modules/typedarray-to-buffer/**/**',
    // 'node_modules/is-typedarray/**/**',
    // 'node_modules/google-protobuf/google-protobuf.js',
  ]
}


function copy () {
  return gulp.src(`${paths.javascripts}/**/**`).pipe(gulp.dest(`${paths.static}/js`))
}

function copyJSON() {
  return gulp.src(`${paths.json}/**/**`).pipe(gulp.dest(`${paths.static}/json`))
}

function copyNodeModules() {
  return gulp.src(paths.copyNodeModules).pipe(gulp.dest(`${paths.static}/js/lib`))
}


function clean () {
  return gulp.src(paths.static, { allowEmpty: true }).pipe(del())
}


function server () {
  return nodemon({
    script: 'server.js',
    ext: 'pug js',
    ignore: [
      'assets/**/**',
      `${paths.static}/**/**`,
      'node_modules/**/**'
    ],
    env: {
      NODE_ENV: 'development'
    }
  })
  .on('restart', () => {
    console.log('SERVER RESTARTED')
  })
}

const build = gulp.series(clean, gulp.parallel(copy, copyJSON, copyNodeModules, server))

gulp.task('default', build)


exports.clean = clean
exports.copy = copy
exports.copyJSON = copyJSON
exports.copyNodeModules = copyNodeModules
exports.server = server