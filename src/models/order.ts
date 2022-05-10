// @ts-ignore
import Client from '../database'
export type Order = {
    id :number,
    status :string,
    user_id :number
}
export type OrderProduct ={
    id:number,
    product_id:number,
    order_id:number,
    quantity:number
}
export class OrderStore {
    async index(user_id :number):Promise<Order[]>{
        try {
            // @ts-ignore
            const conn = await Client.connect();
            const sql = 'SELECT * FROM orders where user_id=$1';
            const result = await conn.query(sql,[user_id])
            conn.release()
            return result.rows
             
        } catch (error) {
            throw new Error(`Could not get Orders. ${error}`)
        }
    }
    async create(user_id:number) :Promise<Order>{
        try {
            // @ts-ignore
            const conn = await Client.connect();
            const sql = 'INSERT into orders(user_id) VALUES($1) RETURNING *';
            //optional : we can update other orders to be closed so we have only one active order(cart) at all time
            const sql_2=`UPDATE orders set status='closed'`
            await conn.query(sql_2)
            const result = await conn.query(sql,[user_id])
            
            conn.release()
            return result.rows[0]  
        } catch (error) {
            throw new Error(`Could not add order. ${error}`)
        }
    }
    async delete(id:number):Promise<Order>{
        try {
            const sql = 'DELETE FROM orders WHERE id=($1)  RETURNING *'
            // @ts-ignore
            const conn = await Client.connect()
            const result = await conn.query(sql, [id])
            const order = result.rows[0]
            conn.release()
            return order;
        } catch (error) {
            throw new Error(`Cannot delete order, ${error}`)
        }
    }
    async show(user_id:number,order_id:number) :Promise<Order> {
        try {
            // @ts-ignore
            const conn = await Client.connect();
            const sql = "SELECT * FROM orders where user_id=$1 AND id=$2";
            const result = await conn.query(sql,[user_id,order_id])
            conn.release()
            return result.rows[0]    
        } catch (error) {
            throw new Error(`Could not get Orders. ${error}`)
        }
    }
    async showRecent(user_id:number) :Promise<Order> {
        try {
            // @ts-ignore
            const conn = await Client.connect();
            const sql = `SELECT * FROM orders where user_id=$1 AND status='active'`;
            const result = await conn.query(sql,[user_id])
            conn.release()
            return result.rows[0]    
        } catch (error) {
            throw new Error(`Could not get Orders. ${error}`)
        }
    }
    async addProduct(order_id : number,product_id:number,quantity :number) :Promise<OrderProduct> {
        try {
            //@ts-ignore
            const conn = await Client.connect();
            const sql= "INSERT INTO order_products(order_id,product_id,quantity) VALUES($1,$2,$3) RETURNING *"
            const result = await conn.query(sql,[order_id,product_id,quantity]);
            conn.release()
            return result.rows[0]
        } catch (error) {
            throw new Error(`Could not add product to order. ${error}`)
        }
    }
}