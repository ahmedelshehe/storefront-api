# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
## Users Endpoint
INDEX route: 'users/' [GET] 
CREATE route: 'users/create' [POST] 
UPDATE route: 'users/update/:id' [POST] 
SHOW route: 'users/show/:id' [GET] 
SIGN IN route: 'users/signin' [POST] 
DELETE route :'users/delete'[POST]
## Products Endpoint
INDEX route: 'products/' [GET] 
CREATE route: 'products/create' [POST] 
UPDATE route: 'products/update/:id' [POST] 
SHOW route: 'products/show/:id' [GET] 
DELETE route :'products/delete'[POST]
# Orders Endpoints
INDEX route: 'orders/' [GET] 
CREATE route: 'orders/create' [POST] 
UPDATE route: 'orders/update/:id' [POST] 
SHOW route: 'orders/show/:id/:order_id' [GET] 
DELETE route :'orders/delete'[POST]
RECENT ORDER 'orders/recent/:id' [GET]
ADD_PRODUCT 'orders/:order_id/products' [POST]

#### Products
- Index 
- Show
- Create [token required]
- [OPTIONAL] Top 5 most popular products 
- [OPTIONAL] Products by category (args: product category)

#### Users
- Index [token required]
- Show [token required]
- Create N[token required]

#### Orders
- Current Order by user (args: user id)[token required]
- [OPTIONAL] Completed Orders by user (args: user id)[token required]

## Data Shapes

## Users Table 
- (id:integer (primary key),username:varchar(100),first_name:varchar(100),last_name:varchar(100),email:varchar(150),password:varhcar(150))
## Products Table
- (id:integer (primary key),name:varchar(100),price:double)
## Orders Table
- (id:integer,status varchar(100) (default:"active"),user_id:integer(foreign key of users table))
## Order Products Table 
- (id:integer(primary key),order_id:integer(foreign key for orders table),product_id:integer(foreign key for products table),quantity:integer)
#### Product
-  id
- name
- price
- [OPTIONAL] category
#### User
- id
- firstName
- lastName
- password

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)