import dotenv from 'dotenv'
import { Request,Response,NextFunction } from 'express';
import jwt, {Secret } from 'jsonwebtoken';
dotenv.config()
const {
    TOKEN_SECRET 
} = process.env 
const verifyToken =(req :Request,res:Response,next:NextFunction) =>{
    const token = req.cookies['x-access-token'] || req.body.token;
    if(token ==null) {
        return res.status(500).send("Unauthorized Action")
    } else {
        try {
            jwt.verify(token,TOKEN_SECRET as Secret)
            req.body.token=token
            req.headers["x-access-token"]=token
            return next()
        } catch (error) {
            return res.status(500).send("Unauthorized Action")
        }
    }
}
export default verifyToken;