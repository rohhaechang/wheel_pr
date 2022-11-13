const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

app.listen(8080, function() {
  console.log('listening on 8080')
});

let db = new sqlite3.Database('./db/sample.db', (err) => {
  if(err) {
    console.log(err.message);
  }
  console.log('db connecting');
})

let sql = `SELECT addr FROM data2`;

db.all(sql, [], (err, rows) => {
  if (err) {
    throw err;
  }
  rows.forEach((row) => {
    console.log(row);
  });
});

app.use(express.static(path.join(__dirname, '../FE/build')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../FE/build/index.html'));
})

app.post('/', (req, res) => {
  res.send('hello');
})