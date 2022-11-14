const express = require('express');
const path = require('path');
const app = express();
const api = require('./api');

app.listen(8080, function() {
  console.log('listening on 8080')
});

app.use(express.static(path.join(__dirname, './FE/build')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, './FE/build/index.html'));
})

app.use("/api", api);