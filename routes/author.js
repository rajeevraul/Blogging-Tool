
/**
 * These are example routes for user management
 * This shows how to correctly structure your routes for the project
 */

const express = require("express");
const Router = express.Router();
const assert = require('assert');

Router.use(express.json());       // to support JSON-encoded bodies
Router.use(express.urlencoded()); // to support URL-encoded bodies

// Route to render the author's homepage
Router.get('/', (req, res, next) => {
  // SQL query to fetch settings from the database
  let sqlquery = "SELECT * FROM Settings";
  global.db.all(sqlquery, function (err, setting) {
    if (err) {
      next(err);
    } else {
      sqlquery2 = "SELECT * FROM Articles ORDER BY article_last_modified_date DESC";
      global.db.all(sqlquery2, function (err, articles) {
        if (err) {
          next(err);
        } else {
          res.render("author/author-homepage", {
            settings: { name: setting[0].author_name, blogTitle: setting[0].blog_title, subTitle: setting[0].blog_subtitle },
            draft_articles: articles.filter(row => row.article_state == 0),
            published_articles: articles.filter(row => row.article_state == 1)
          });
        }
      });
    }
  });
});

// Route to render the author's settings page
Router.get("/update-settings", (req, res) => {
    // SQL query to fetch settings from the database
  let sqlquery = "SELECT * FROM Settings";
  global.db.all(sqlquery, function (err, row) {
    if (err) {
      next(err);
    } else {
      //Render the 'author-settings' view with fetched data from the database
      res.render("author/author-settings", { name: row[0].author_name, blogTitle: row[0].blog_title, subTitle: row[0].blog_subtitle }
      );
    }
  });
});

// Define a route for the settings page
Router.get('/settings', (req, res) => {
  let sqlquery = "SELECT * FROM Settings";
  global.db.all(sqlquery, function (err, row) {
    if (err) {
      next(err);
    } else {
      res.render("author/author-settings", { name: row[0].author_name, blogTitle: row[0].blog_title, subTitle: row[0].blog_subtitle }
      );
    }
  });
});

// Route to update the author's settings
Router.post("/update-settings", (req, res) => {
  // DB Interaction : update the Settings table with the new values from the form
  let sqlquery =
  "UPDATE Settings SET 'blog_title'=?, 'blog_subtitle'=?, 'author_name'=?";
  global.db.run(
    sqlquery, [req.body.blog_title, req.body.blog_subtitle, req.body.author_name],
    function (err) {
      if (err) {
        next(err);
      } else {
        res.redirect("/author");
      }
    }
  );
});

// Route to render the author's edit article page
Router.get('/edit-article', (req, res, next) => {
  // SQL query to fetch Articles from the database
  let sqlquery = "SELECT * FROM Articles WHERE article_id = ? AND article_state=0";
  let param = req.query.id;
  global.db.all(sqlquery, param, function (err, row) {
    if (err) {
      next(err);
    } else {
      //Render the 'author-edit-article' view with fetched data from the database
      res.render("author/author-edit-article", 
      { article_id: row[0].article_id, article_title: row[0].article_title, article_subtitle: row[0].article_subtitle, 
       article_text:row[0].article_text, article_create_date:row[0].article_create_date, 
       article_last_modified_date: row[0].article_last_modified_date, article_state:row[0].article_state}
      );
    }
  });
});

// Route to publish article
Router.get('/publish-article', (req, res, next) => {
  let sqlquery = "UPDATE Articles SET article_state=1, article_publication_date=datetime('now') WHERE article_id = ?";
  let param = req.query.id;
  global.db.all(sqlquery, param, function (err, row) {
    if (err) {
      next(err);
    } else {
      let sqlquery2 = "SELECT * FROM Settings";
      global.db.all(sqlquery2, function (err2, setting) {
        if (err2) {
          next(err2);
        } else {
          sqlquery3 = "SELECT * FROM Articles ORDER BY article_last_modified_date DESC";
          global.db.all(sqlquery3, function (err3, articles) {
            if (err3) {
              next(err3);
            } else {
              res.render("author/author-homepage", {
                settings: { name: setting[0].author_name, blogTitle: setting[0].blog_title, subTitle: setting[0].blog_subtitle },
                draft_articles: articles.filter(row => row.article_state == 0),
                published_articles: articles.filter(row => row.article_state == 1)
              });
            }
          });
        }
      });
    }
  });
});


// Route to delete article
Router.get('/delete-article', (req, res, next) => {
  // SQL query to delete Articles from the database
  let sqlcomments = "DELETE FROM Comments WHERE article_id=?";
  let param = req.query.id;
  global.db.all(sqlcomments, param, function (errcomments) {
    if (errcomments) {
      next(errcomments);
    } else {
      let sqlquery = "DELETE FROM Articles WHERE article_id = ?";
      global.db.all(sqlquery, param, function (err) {
        if (err) {
          next(err);
        } else {
          let sqlquery2 = "SELECT * FROM Settings";
          global.db.all(sqlquery2, function (err2, setting) {
            if (err2) {
              next(err2);
            } else {
              sqlquery3 = "SELECT * FROM Articles ORDER BY article_last_modified_date DESC";
              global.db.all(sqlquery3, function (err3, articles) {
                if (err3) {
                  next(err3);
                } else {
                  res.render("author/author-homepage", {
                    settings: { name: setting[0].author_name, blogTitle: setting[0].blog_title, subTitle: setting[0].blog_subtitle },
                    draft_articles: articles.filter(row => row.article_state == 0),
                    published_articles: articles.filter(row => row.article_state == 1)
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});

// Route to create new draft
Router.post('/create-new-draft', (req, res, next) => {
    // SQL query to post Articles from the database
    let sqlquery = "INSERT INTO Articles ('article_title', 'article_subtitle', 'article_text', 'article_create_date', 'article_last_modified_date', 'article_state') VALUES ('', '', '',datetime('now'), datetime('now'), 0) RETURNING article_id";
    global.db.all(sqlquery, function (err, row) {
      if (err) {
        next(err);
      } else {
          //Redirect the 'author-edit-article' view with fetched data from the database
          res.redirect("edit-article?id="+row[0].article_id);
      }
    });
});

// Route to update article
Router.post('/update-article', (req, res, next) => {
  // SQL query to post Articles from the database
  let sqlquery = "UPDATE Articles SET article_title=?, article_subtitle=?, article_text=?, article_last_modified_date=datetime('now') WHERE article_id=?";
  global.db.run(
    sqlquery, [req.body.article_title, req.body.article_subtitle, req.body.article_text, req.body.article_id],
    function (err) {
      if (err) {
        next(err); //send the error on to the error handler
      } else {
        res.redirect("/author");
      }
    }
  );
});



///////////////////////////////////////////// HELPERS ///////////////////////////////////////////

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
