// server.js
// where your node app starts

// init project
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// init sqlite db
const dbFile = "./.data/scribetoy.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(() => {
  if (!exists) {
    // do create database stuff
  } else {
    console.log('refs database is good!');
    db.each("SELECT * from refs ORDER BY random() LIMIT 5", (err, row) => {
      if (row) {
        console.log(`record: ${row.ref}`);
      }
    });
  }
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(`${__dirname}/views/index.html`);
});

// endpoint for "get whatever random shit"
app.get("/getAnything", (request, response) => {
  db.get("SELECT * FROM refs ORDER BY random() LIMIT 1", (err, row) => {
    response.send(JSON.stringify(row));
  });
});

// endpoint to grab selectively by book
app.get("/getByBook/:book", (request, response) => {
  let book = request.params.book
  db.get("SELECT * FROM refs WHERE book = (?) ORDER BY random() LIMIT 1", [book], (err, row) => {
    response.send(JSON.stringify(row));
  });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});