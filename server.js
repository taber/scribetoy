// init project
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"));

// init sqlite db
const dbFile = "./scribetoy.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);


db.serialize(() => {
  if (!exists) {
    // do create database stuff I guess, not gonna need this here I hope???
  } else {
    console.log('refs database is good, here are five refs to prove it!');
  }
});

app.get("/", (request, response) => {
  response.sendFile(`${__dirname}/views/index.html`);
});

// endpoint for "get a verse from literally anywhere in the Tanakh"
app.get("/getAnything", (request, response) => {
  db.get("SELECT * FROM refs ORDER BY random() LIMIT 1", (err, row) => {
    response.send(row);
  });
});

// endpoint to grab selectively by book (not in use yet)
app.get("/getByBook/:book", (request, response) => {
  let book = request.params.book;
  db.get("SELECT * FROM refs WHERE book = (?) ORDER BY random() LIMIT 1", [book], (err, row) => {
    response.send(row);
  });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});