const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const router = express.Router();

let sql = `SELECT addr FROM data2`;

let array = [];

let db = new sqlite3.Database('./db/sample.db', (err) => {
  if(err) {
    console.log(err.message);
  }
  db.all(sql, [], (err, rows) => {
    if(err) {
      throw err;
    }
    array = rows;
    router.get("/", (req, res) => {
      res.send(rows);
    })
  })
})

router.post('/', (req, res) => {
  console.log('post');
})

module.exports = router;