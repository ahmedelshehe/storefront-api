import dotenv from 'dotenv'
import jwt, {Jwt, Secret } from 'jsonwebtoken';
import { User } from '../models/user';
const {
    TOKEN_SECRET 
} = process.env 
interface JwtPayload {
    id :number, 
    username:string,
    first_name:string,
    last_name:string,
    password:string,
    email:string
}
dotenv.config()
const decodeToken=async (token :string) : Promise<number> =>{
    token.split(' ')[1];
    try {
        const userInfo = jwt.verify(token, TOKEN_SECRET as Secret) as JwtPayload
        return userInfo.id
    } catch (e) {
        throw new Error(`Unutorized action. ${e}`)
    }

}
export default decodeToken;