import express,{Request , Response } from 'express';
import {Order ,OrderStore} from '../models/order';
import auth from '../middleware/auth'
import dotenv from 'dotenv'
import decodeToken from '../functions/decodeToken';

dotenv.config()
const store = new OrderStore();
const orders_routes =(app:express.Application) => {
    app.get('/orders',auth,index);
    app.get('/orders/show/:id/:order_id',auth,show)
    app.get('/orders/recent/:id',auth,showRecent)
    app.post('/orders/create',auth,create),
    app.post('/orders/:order_id/products',auth,add_product)
    app.post('/orders/delete',auth,destroy)
}

const index =async (req :Request,res:Response) =>{
    const token = req.headers["x-access-token"] || req.body.token;
    try {
        const user_id=await decodeToken(token)
        const order = await store.index(user_id);
        res.json({order})
    } catch (e) {
        return res.status(401).send('unauthorized'+e);
    }

}
const show=async(req :Request ,res :Response) =>{
    try {
        const order=await store.show(parseInt(req.params['id']),parseInt(req.params['order_id']));
        res.json(order);
    } catch (error) {
        res.status(401);
    }  
}
const showRecent=async(req :Request ,res :Response) =>{
    try {
        const order=await store.showRecent(parseInt(req.params['id']));
        res.json(order);
    } catch (error) {
        res.status(401);
    }  
}
const create =async(req :Request ,res :Response) => {
    const token = req.headers["x-access-token"] || req.body.token;
    try {
        const user_id=await decodeToken(token)
        const new_order=await store.create(user_id);
        res.json(new_order);
    } catch (error) {
        res.status(401);
    }
}
const add_product=async(req :Request ,res :Response) => {
    try {
        const order_id=parseInt(req.params['order_id'])
        const product_id=req.body.product_id
        const quantity=req.body.quantity
        const order = await store.addProduct(order_id,product_id,quantity);
        res.json(order)
    } catch (error) {
        res.status(401).send({message :"cannot add product to order"+error})
    }
}
const destroy=async (req:Request,res:Response) =>{
    let order_id:number=req.body.id
    try {
        const deleted_order=await store.delete(order_id);
        if(deleted_order==undefined){
            return res.status(401).send('user does not exists');
        }
        res.status(200).json(deleted_order)
    } catch (e) {
        return res.status(401).send('unauthorized'+e);
    }
}
export default orders_routes;