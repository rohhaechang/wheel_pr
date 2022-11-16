const express = require('express');
const path = require('path');
const app = express();
const api1 = require('./api1');
const api2 = require('./api2');
const api3 = require('./api3');
const bodyParser = require('body-parser');

/** 클라이언트에서 받아오는 데이터의 양 늘리기 */
app.use(express.json({limit: '1000mb'}));
var cors = require('cors');
app.use(bodyParser.urlencoded({limit: '1000mb', extended: false}))

app.use(cors({
  origin: '*',
  credential: 'true'
}));

app.listen(8080, function() {
  console.log('listening on 8080')
});

app.use(express.static(path.join(__dirname, './FE/build')));


app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, './FE/build/index.html'));
})

app.use("/api1", api1);
app.use('/api2', api2);
app.use('/api3', api3);