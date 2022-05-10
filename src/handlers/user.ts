import express,{Request , Response } from 'express';
import {User ,UserStore} from '../models/user';
import jwt, { Secret } from 'jsonwebtoken';
import dotenv from 'dotenv'
import auth from '../middleware/auth'
import decodeToken from '../functions/decodeToken';

dotenv.config()
const {
    TOKEN_SECRET 
} = process.env 
const store =  new UserStore();
const user_routes =(app:express.Application) => {
    app.get('/users',auth,index);
    app.post('/users/create',auth,create);
    app.get('/users/show/:id',auth,show)
    app.post('/users/signin',signIn);
    app.post('/users/update/:id',update);
    app.post('/users/delete',auth,destroy)
}
const index =async (_req :Request,res:Response) =>{
    const users=await store.index();
    res.json({users})
}
const create =async(req :Request ,res :Response) => {
    const user :User = {
        username : req.body.username,
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        password :req.body.password,
        email :req.body.email
    }
    const new_user=await store.create(user);
    const token=jwt.sign(new_user,TOKEN_SECRET as Secret, { expiresIn: '1800s' })
    res.json({"token":token,user:new_user})
}
const signIn=async(req :Request ,res :Response) =>{
    const username :string=req.body.username;
    const password:string=req.body.password;
    
    try {
        const user=await store.signIn(username,password);
        const token=jwt.sign(user,TOKEN_SECRET as Secret)
        let options = {
            path:"/",
            sameSite:true,
            maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
            httpOnly: true, // The cookie only accessible by the web server
        }
        res.cookie('x-access-token',token,options)
        res.json([user,token]);
    } catch (error) {
        res.status(500).send({message :`Cannot sign in : `+error});
    }  
}
const show=async(req :Request ,res :Response) =>{
    try {
        const user=await store.show(parseInt(req.params['id']));
        res.send(user);
    } catch (error) {
        res.status(401).send({message :`Cannot find user : `+error});;
    }  
}
const update =async (req:Request,res:Response) => {
        const username = req.body.username
        const first_name=req.body.first_name
        const last_name=req.body.last_name
        const password =req.body.password
        const email =req.body.email
        const token = req.headers["x-access-token"] || req.body.token;
        try {
            const user_id=await decodeToken(token) || parseInt(req.params['id'])
            const updated_user=await store.update(username,first_name,last_name,email,password,user_id);
            res.status(200).json(updated_user)
        } catch (e) {
            return res.status(401).send('unauthorized'+e);
        }
}
const destroy=async (req:Request,res:Response) =>{
    let user_id:number=req.body.id
    try {
        const deleted_user=await store.delete(user_id);
        if(deleted_user==undefined){
            return res.status(401).send('user does not exists');
        }
        res.status(200).json(deleted_user)
    } catch (e) {
        return res.status(401).send('unauthorized'+e);
    }
}

export default user_routes;