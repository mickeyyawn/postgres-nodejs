var os = require('os');
var util = require('util');
var path = require('path');
var process = require('process')

const cluster = require('cluster')
const numCPUs = os.cpus().length;
const { PORT = 3000 } = process.env
HOST = '0.0.0.0'
const express = require('express')
const app = express()


app.use(express.static('public'))

global.appRoot = path.resolve(__dirname);

app.get('/', function (req, res) {

  res.json({"status":"ok"});

})

var start = function (app, PORT, HOST) {

  if (cluster.isMaster) {

    for (var i = 0; i < numCPUs; i++) {
      cluster.fork()
    }

    cluster.on('exit', (worker, code, signal) => {

      console.log(util.format('Worker %s died...', worker.process.pid))
      cluster.fork() // spin up another process since this one decided to exit

    })
  } else {

    process.title = util.format('Node - %s', 'postgres-nodejs')
    app.listen(PORT, HOST)
    console.log(util.format('Server running at http://%s:%s/' + ' PID: %s', HOST, PORT, cluster.worker.process.pid))

  }

}

start(app, PORT, HOST);


