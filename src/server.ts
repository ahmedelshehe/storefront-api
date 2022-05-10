import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from "cors"
import cookieParser from "cookie-parser"
import user_routes from './handlers/user'
import products_routes from './handlers/product'
import orders_routes from './handlers/order'
const app: express.Application = express()
const address: string = "0.0.0.0:3000"
//middlwares
app.use(bodyParser.json())
app.use(cors())
app.use(cookieParser())

app.get('/', function (req: Request, res: Response) {
    res.send('Hello World!')
})
user_routes(app);
products_routes(app);
orders_routes(app);
app.listen(3000, function () {
    console.log(`starting app on: ${address}`)
})
export default app;