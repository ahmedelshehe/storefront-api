Create table users (
    id SERIAL PRIMARY  KEY,
    username VARCHAR(100),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(150),
    password VARCHAR(150)
);