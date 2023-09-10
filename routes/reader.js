const express = require("express");
const Router = express.Router();
const assert = require('assert');

Router.use(express.json());       // to support JSON-encoded bodies
Router.use(express.urlencoded()); // to support URL-encoded bodies

// Route to render the reader's homepage
Router.get('/', (req, res, next) => {
  let sqlquery2 = "SELECT * FROM Settings";
  global.db.all(sqlquery2, function (err2, setting) {
    if (err2) {
      next(err2);
    } else {
      sqlquery3 = "SELECT * FROM Articles WHERE article_state=1 ORDER BY article_publication_date DESC";
      global.db.all(sqlquery3, function (err3, articles) {
        if (err3) {
          next(err3);
        } else {
          res.render("reader/reader-homepage", {
            settings: { name: setting[0].author_name, blogTitle: setting[0].blog_title, subTitle: setting[0].blog_subtitle },
            articles: articles
          });
        }
      });
    }
  });
});


// Route to read articles
Router.get('/read-article', (req, res, next) => {
  // SQL query to fetch Articles from the database
  let sqlquery = "SELECT * FROM Articles WHERE article_id = ? AND article_state=1";
  let param = req.query.id;
  global.db.all(sqlquery, param, function (err, articles) {
    if (err) {
      next(err);
    } else {
      sqlquery2 = "SELECT * FROM Comments WHERE article_id = ? ORDER BY comment_create_date DESC";
      global.db.all(sqlquery2, param, function (err, comments) {
        res.render("reader/reader-article", 
        { article: articles[0],
          comments: comments,
        }
      );
      });
    }
  });
});


// Route to add likes
Router.post("/add-likes", (req, res, next) => {
  // DB Interaction : update the number of likes for an article in the Articles 
  console.log(req.body);
  let sqlquery =
    "UPDATE Articles SET article_likes = article_likes + 1 WHERE article_id = ?;";
  global.db.run(
    sqlquery, [Number(req.body.article_id)],
    function (err) {
      if (err) {
        next(err);
      } else {
        res.redirect("/reader/read-article?id=" + Number(req.body.article_id));
      }
    }
  );
});

// Comments
Router.post("/create-comments", (req, res, next) => {
  let sqlquery = "INSERT INTO Comments ('comment_content', 'comment_create_date', 'article_id') VALUES (?, datetime('now'), ?);";
  let params = [req.body.comment_text, req.body.article_id];
  global.db.run(
    sqlquery, params,
    function (err) {
      if (err) {
        next(err);
      } else {
        res.redirect("/reader/read-article?id=" + req.body.article_id);
      }
    }
  );
});


///////////////////////////////////////////// HELPERS ////////////////////////////////////////

/**
 * @desc A helper function to generate a random string
 * @returns a random lorem ipsum string
 */
function generateRandomData(numWords = 5) {
  const str =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";

  const words = str.split(" ");

  let output = "";

  for (let i = 0; i < numWords; i++) {
    output += choose(words);
    if (i < numWords - 1) {
      output += " ";
    }
  }

  return output;
}

/**
 * @desc choose and return an item from an array
 * @returns the item
 */
function choose(array) {
  assert(Array.isArray(array), "Not an array");
  const i = Math.floor(Math.random() * array.length);
  return array[i];
}

module.exports = Router;
