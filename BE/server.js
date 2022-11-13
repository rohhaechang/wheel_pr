const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

const db = new sqlite3.Database('./db/sample.db', (err) => {
  if(err) {
    console.error(err.message);
  } else {
    console.log('Connected to the mydb database');
  }
});

app.listen(8080, function() {
  console.log('listening on 8080')
});

app.use(express.static(path.join(__dirname, '../FE/build')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../FE/build/index.html'));
  db.all(`SELECT addr FROM data2`, (err, data) => {
    if(err) {
      console.log('err');
    } else {
      console.log('success');
      res.send(data);
    }
  })
})