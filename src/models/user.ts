import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
// @ts-ignore
import Client from '../database'
dotenv.config()
const {
    SALT_ROUNDS ,
    BCRYPT_PASSWORD
} = process.env 
const saltRounds =SALT_ROUNDS as unknown as string
const pepper  =BCRYPT_PASSWORD
export type User = {
    id? :number, 
    username:string,
    first_name:string,
    last_name:string,
    email:string
    password:string
    
}
export class UserStore{
    async index() :Promise<User[]>{
        try {
            // @ts-ignore
            const conn = await Client.connect();
            const sql = 'SELECT * FROM users';
            const result = await conn.query(sql)
            conn.release()
            return result.rows     
        } catch (error) {
            throw new Error(`Could not get users. ${error}`)
        }
    }
    async show(id:number) :Promise<User>{
        try {
            
            // @ts-ignore
            const conn = await Client.connect();
            const sql = 'SELECT id,username,first_name,last_name,email FROM users where id=$1';
            const result = await conn.query(sql,[id])
            conn.release()
            return result.rows[0]
        } catch (error) {
            throw new Error(`Could not get user. ${error}`)
        }
    }
    async create(user:User) :Promise<User>{
        try {
            // @ts-ignore
            const conn = await Client.connect();
            const sql = 'INSERT INTO users(username,first_name,last_name,email,password) VALUES($1,$2,$3,$4,$5) RETURNING *';
            const hashPassword=bcrypt.hashSync(user.password+pepper,parseInt(saltRounds))
            const result = await conn.query(sql,[user.username,user.first_name,user.last_name,user.email,hashPassword]);
            conn.release()
            return result.rows[0]  
        } catch (error) {
            throw new Error(`Could not get users. ${error}`)
        }
    }
    async update(username:string,first_name:string,last_name:string,email:string,password:string,id:number) :Promise<User>{
        try {
            // @ts-ignore
            const conn = await Client.connect();
            const sql = 'UPDATE  users SET username=$1,first_name=$2,last_name=$3,email=$4,password=$5 where id=$6 RETURNING *';
            const hashPassword=bcrypt.hashSync(password+pepper,parseInt(saltRounds))
            const result = await conn.query(sql,[username,first_name,last_name,email,hashPassword,id]);
            conn.release()
            return result.rows[0]
        } catch (error) {
            throw new Error(`Could not update user. ${error}`)
        }
    }
    async delete(id:number):Promise<User>{
        try {
            const sql = 'DELETE FROM users WHERE id=($1) RETURNING *'
            // @ts-ignore
            const conn = await Client.connect()
            const result = await conn.query(sql, [id])
            const user = result.rows[0]
            conn.release()
            return user;
        } catch (error) {
            throw new Error(`Cannot delete user, ${error}`)
        }
    }
    async signIn(username:string ,password:string) :Promise<User> {
        try {
            const sql = 'SELECT * FROM users WHERE username=$1'
            // @ts-ignore
            const conn = await Client.connect()
            const result = await conn.query(sql, [username])
            const user = result.rows[0]
            conn.release()
            if(user){
                return new Promise<User>((resolve,reject)=>{
                    if (bcrypt.compareSync(password+pepper, user.password)) {
                        resolve(user)
                    } else {
                        reject('Wrong Password')
                    }
                })
            } else {
                throw new Error
            }
        } catch (error) {
            throw new Error(`Error Finding user`)
        }
        
        
    }
}