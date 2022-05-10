import express,{Request , Response } from 'express';
import {Product ,ProductStore} from '../models/product';
import auth from '../middleware/auth'

const store = new ProductStore();
const products_routes =(app:express.Application) => {
    app.get('/products',index);
    app.get('/products/show/:id',show)
    app.post('/products/create',auth,create);
    app.post('/products/update/:id',auth,update);
    app.post('/products/delete',auth,destroy)
}

const index =async (_req :Request,res:Response) =>{
    const products=await store.index();
    res.json(products)
}
const show=async(req :Request ,res :Response) =>{
    try {
        const product=await store.show(parseInt(req.params['id']));
        res.json(product);
    } catch (error) {
        res.status(401).send({message:"Cannot show product :"+error});
    }  
}
const create =async(req :Request ,res :Response) => {
    try {
        const product :Product = {
            name :req.body.name,
            price:req.body.price
        }
        const new_product=await store.create(product);
        res.status(200).json({new_product});
    } catch (error) {
        res.status(401).send({message:"Cannot create product :"+error});
    }
}
const update=async (req:Request,res:Response) =>{
    try {
        const updated_product=await store.update(req.body.name,req.body.price,parseInt(req.params['id']))
        res.status(200).json({updated_product})
    } catch (error) {
        res.status(401).send({message:"Cannot update product :"+error});
    }
}
const destroy=async (req:Request,res:Response) =>{
    let product_id:number=req.body.id
    try {
        const deleted_product=await store.delete(product_id);
        if(deleted_product==undefined){
            return res.status(401).send('user does not exists');
        }
        res.status(200).json(deleted_product)
    } catch (e) {
        return res.status(401).send('unauthorized'+e);
    }
}
export default products_routes;