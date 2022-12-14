const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const router = express.Router();

let data1 = `SELECT * FROM data1`;

let db = new sqlite3.Database('./db/sample.db', (err) => {
  if(err) {
    console.log(err.message);
  }
  db.all(data1, [], (err, rows) => {
    if(err) {
      throw err;
    }
    router.get("/", (req, res) => {
      res.send(rows);
    })
  })
})

module.exports = router;