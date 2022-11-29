-- DROP TABLE IF EXISTS users CASCADE;
-- CREATE TABLE users(
--     users_id SERIAL PRIMARY KEY,
--     email VARCHAR(50) NOT NULL,
--     password CHAR(60) NOT NULL
-- );
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users
(
    username VARCHAR(50) PRIMARY KEY,
    password CHAR(60) NOT NULL
);

DROP TABLE IF EXISTS movies CASCADE;
CREATE TABLE movies
(
    movie_id    SERIAL PRIMARY KEY,
    movie_name  VARCHAR(50)  NOT NULL,
    movie_image VARCHAR(1000)  NOT NULL,
    duration    SMALLINT     NOT NULL,
    genre VARCHAR(20) NOT NULL,
    yearOfRelease SMALLINT NOT NULL,
    description    VARCHAR(1000) NOT NULL,
    skono       BIGINT       NOT NULL
);

DROP TABLE IF EXISTS reviews CASCADE;
CREATE TABLE reviews
(
    review_id   SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    movie_id INT NOT NULL,

    FOREIGN KEY (username) REFERENCES users(username),
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id),
    review_text VARCHAR(1000) NOT NULL
);

DROP TABLE IF EXISTS users_to_movies CASCADE;
CREATE TABLE users_to_movies
(
    username VARCHAR(50) NOT NULL,
    movie_id INT NOT NULL,
    FOREIGN KEY (username) REFERENCES users (username),
    FOREIGN KEY (movie_id) REFERENCES movies (movie_id)
--     Rating is being used to track if a movie is sko'd or no'd
    --rating INT NOT NULL
);


