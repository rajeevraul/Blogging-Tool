const express = require('express');
const app = express();
const port = 3000;
const sqlite3 = require('sqlite3').verbose();

app.use(express.json());       // to support JSON-encoded bodies
app.use('/assets', express.static('assets'));

// Items in the global namespace are accessible throughout the node application
global.db = new sqlite3.Database('./database.db', function (err) {
  if (err) {
    console.error(err);
    process.exit(1); // Bail out, we can't connect to the DB
  } else {
    console.log('Database connected');
    global.db.run('PRAGMA foreign_keys=ON'); // This tells SQLite to pay attention to foreign key constraints
  }
});

const readerRoutes = require('./routes/reader');
const authorRoutes = require('./routes/author');

// Set the app to use ejs for rendering
app.set('view engine', 'ejs');

// Define a route for the home page
app.get('/', (req, res) => {
  res.redirect('/author/');
});

// This adds all the readerRoutes to the app under the path /reader
app.use('/reader', readerRoutes);
app.use('/author', authorRoutes);

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});