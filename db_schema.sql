
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

--create your tables with SQL commands here (watch out for slight syntactical differences with SQLite)

CREATE TABLE IF NOT EXISTS Articles (
    article_id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_title VARCHAR(255) NOT NULL,
    article_subtitle VARCHAR(255) NOT NULL,
    article_text TEXT NOT NULL,
    article_likes INTEGER DEFAULT 0, 
    article_create_date DATE NOT NULL,
    article_last_modified_date DATE NOT NULL,
    article_publication_date DATE,
    article_state INTEGER CHECK(article_state=0 or article_state=1)
);

CREATE TABLE IF NOT EXISTS Settings (
    id INTEGER PRIMARY KEY,
    blog_title VARCHAR(255) NOT NULL,
    blog_subtitle VARCHAR(255) NOT NULL,
    author_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Comments (
    comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    comment_content TEXT NOT NULL,
    comment_create_date DATE NOT NULL,
    article_id INTEGER,
    FOREIGN KEY (article_id) REFERENCES Articles(article_id)
);

--insert default data (if necessary here)

INSERT INTO Articles ('article_title', 'article_subtitle', 'article_text', 'article_create_date', 'article_last_modified_date', 'article_state') VALUES ('Article Title', 'Article Subtitle', 'Article Text',datetime('now'), datetime('now'), 0);
INSERT INTO Articles ('article_title', 'article_subtitle', 'article_text', 'article_create_date', 'article_last_modified_date', 'article_state') VALUES ('Article Title', 'Article Subtitle', 'Article Text',datetime('now'), datetime('now'), 0);
INSERT INTO Articles ('article_title', 'article_subtitle', 'article_text', 'article_create_date', 'article_last_modified_date', 'article_state') VALUES ('Article Title', 'Article Subtitle', 'Article Text',datetime('now'), datetime('now'), 0);

INSERT INTO Articles ('article_title', 'article_subtitle', 'article_likes', 'article_text', 'article_create_date', 'article_last_modified_date', 'article_publication_date','article_state') VALUES ('Article Title', 'Article Subtitle', 0,' Article Text',datetime('now'), datetime('now'),datetime('now'), 1);
INSERT INTO Articles ('article_title', 'article_subtitle', 'article_likes', 'article_text', 'article_create_date', 'article_last_modified_date', 'article_publication_date','article_state') VALUES ('Article Title', 'Article Subtitle', 0,' Article Text',datetime('now'), datetime('now'),datetime('now'), 1);

INSERT INTO Comments ('comment_content', 'comment_create_date', 'article_id') VALUES ('Sadio Mane is the best footballer in the world', datetime('now'), 1);
   
INSERT INTO Settings('blog_title', 'blog_subtitle', 'author_name') VALUES ('Blog A', 'ALL about A', 'Sadio Mane');

COMMIT;
