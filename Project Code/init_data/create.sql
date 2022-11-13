DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
    users_id SERIAL PRIMARY KEY,
    email VARCHAR(50) NOT NULL,
    password CHAR(60) NOT NULL
);

DROP TABLE IF EXISTS movies CASCADE;
CREATE TABLE movies(
    movie_id SERIAL PRIMARY KEY,
    movie_name VARCHAR(50) NOT NULL,
    movie_image VARCHAR(80) NOT NULL,
    duration SMALLINT NOT NULL,
    describe VARCHAR(100) NOT NULL,
    skoNo BIGINT NOT NULL
);

DROP TABLE IF EXISTS reviews CASCADE;
CREATE TABLE reviews(
    review_id SERIAL PRIMARY KEY,
   
    PRIMARY KEY(contact_id),
    CONSTRAINT fk_user
        FOREIGN KEY(users_id) 
	        REFERENCES users(users_id),
    CONSTRAINT fk_movie
        FOREIGN KEY(movie_id)
            REFERENCES movies(movie_id),
    review_text VARCHAR(100) NOT NULL,
);