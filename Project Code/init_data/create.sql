DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
    username VARCHAR(50) PRIMARY KEY,
    password CHAR(60) NOT NULL
);

CREATE TABLE movies(
    
    -- there should be a movie_name, skos_count, image.png data types here, can someone implement it?
    
);