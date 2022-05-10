// @ts-ignore
import Client from '../database'
export type Product = {
    id? :number,
    name :string,
    price :number
}
export class ProductStore{
    async index() :Promise<Product[]>{
        try {
            // @ts-ignore
            const conn = await Client.connect();
            const sql = 'SELECT * FROM products';
            const result = await conn.query(sql)
            conn.release()
            return result.rows     
        } catch (error) {
            throw new Error(`Could not get Products. ${error}`)
        }
    }
    async create(product:Product) :Promise<Product>{
        try {
            // @ts-ignore
            const conn = await Client.connect();
            const sql = 'INSERT INTO products(name,price) VALUES($1,$2) RETURNING *';
            const result = await conn.query(sql,[product.name,product.price]);
            conn.release()
            return result.rows[0]  
        } catch (error) {
            throw new Error(`Could not get products. ${error}`)
        }
    }
    async update(name:string,price:number,id:number) :Promise<Product>{
        try {
            // @ts-ignore
            const conn = await Client.connect();
            const sql = 'UPDATE  products SET name=$1,price=$2 where id=$3 RETURNING *';
            const result = await conn.query(sql,[name,price,id]);
            conn.release()
            return result.rows[0]
        } catch (error) {
            throw new Error(`Could not get products. ${error}`)
        }
    }
    async delete(id:number):Promise<Product>{
        try {
            const sql = 'DELETE FROM products WHERE id=($1)  RETURNING *'
            // @ts-ignore
            const conn = await Client.connect()
            const result = await conn.query(sql, [id])
            const product = result.rows[0]
            conn.release()
            return product;
        } catch (error) {
            throw new Error(`Cannot delete product, ${error}`)
        }
    }
    async show(id:number) :Promise<Product>{
        try {
            // @ts-ignore
            const conn = await Client.connect();
            const sql = 'SELECT * from products where id=$1';
            const result = await conn.query(sql,[id])
            conn.release()
            return result.rows[0]
        } catch (error) {
            throw new Error(`Could not get product. ${error}`)
        }
    }
}