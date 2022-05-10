# Storefront Backend Project


This repo contains a basic node api for storefront app

##  Technologies Used
- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- jasmine from npm for testing

## Apllication Instalation
```
npm install 
```
## Database Configuration
Add .env file in the root folder and add the following variables
- POSTGRES_HOST=[your_host]
- POSTGRES_DB=[your_dev_database]
- POSTGRES_TEST_DB=[your_test_database]
- POSTGRES_USER=[your_database_user]
- POSTGRES_PASSWORD=[your_database_password]
- BCRYPT_PASSWORD=[your_bcrypt_password]
- SALT_ROUNDS=[your_salt_rounds]
- ENV=[either put "test" or "dev" here]
- TOKEN_SECRET=[your_token_secret]

## To run the Api
```
npm run watch 
```
## To test the Api
```
npm run test 
```
## Ports
- Backend (3000)
- Database (5432)
## API Endpoints
## Users Endpoint
- INDEX route: 'users/' [GET] 
- CREATE route: 'users/create' [POST] 
- UPDATE route: 'users/update/:id' [POST] 
- SHOW route: 'users/show/:id' [GET] 
- SIGN IN route: 'users/signin' [POST] 
- DELETE route :'users/delete'[POST]
## Products Endpoint
- INDEX route: 'products/' [GET] 
- CREATE route: 'products/create' [POST] 
- UPDATE route: 'products/update/:id' [POST] 
- SHOW route: 'products/show/:id' [GET] 
- DELETE route :'products/delete'[POST]
# Orders Endpoints
- INDEX route: 'orders/' [GET] 
- CREATE route: 'orders/create' [POST] 
- UPDATE route: 'orders/update/:id' [POST] 
- SHOW route: 'orders/show/:id/:order_id' [GET] 
- DELETE route :'orders/delete'[POST]
- RECENT ORDER 'orders/recent/:id' [GET]
- ADD_PRODUCT 'orders/:order_id/products' [POST]
## Data Shapes

## Users Table 
- (id:integer (primary key),username:varchar(100),first_name:varchar(100),last_name:varchar(100),email:varchar(150),password:varhcar(150))
## Products Table
- (id:integer (primary key),name:varchar(100),price:double)
## Orders Table
- (id:integer,status varchar(100) (default:"active"),user_id:integer(foreign key of users table))
## Order Products Table 
- (id:integer(primary key),order_id:integer(foreign key for orders table),product_id:integer(foreign key for products table),quantity:integer)
