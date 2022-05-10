Create table orders (
    id SERIAL PRIMARY  KEY,
    status VARCHAR(15) default('active'),
    user_id bigint REFERENCES users(id)
);