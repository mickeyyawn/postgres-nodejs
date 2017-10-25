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

const { Pool, Client } = require('pg')
const connectionString = process.env.DATABASE_URL;



app.get('/', function (req, res) {

  res.send('Hello World!')

})

app.get('/test', function (req, res) {

  console.log('attempting to connect to postgres')
  console.log(connectionString)
  const client = new Client({connectionString: connectionString})
  console.log('initiating connection...')
  client.connect()

  client.query('SELECT NOW()', (err, res) => {
    console.log(err, res)
    client.end()
  })

  res.send('done with test!')

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





async function exercisePostgres() {



  await client.connect()

  const res = await client.query('SELECT NOW()')
  await client.end()

}

start(app, PORT, HOST);
//exercisePostgres()


