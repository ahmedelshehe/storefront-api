import {Order, OrderStore } from "../models/order";
import { User, UserStore } from "../models/user";
import app from '../server';
import supertest from 'supertest';
const store= new OrderStore();
const user_store=new UserStore(); 
const request = supertest(app);
let token :string;
let cookie :string;
describe("Order model Tests",()=>{
    let user:User={
        username : "userorder",
        first_name:"firstname",
        last_name:"lastname",
        password :"password",
        email :"email"
    }
    beforeAll(async ()=>{
        user =await user_store.create(user)
    })
    it('should have an index method',async () => {
        expect(store.index).toBeDefined();
        });
    it('should have a create method', () => {
    expect(store.create).toBeDefined();
        });
    it('should have a delete method', () => {
        expect(store.delete).toBeDefined();
        });
    it('should have a recent order method', () => {
        expect(store.showRecent).toBeDefined();
        });
    it('should have a add order  method', () => {
        expect(store.addProduct).toBeDefined();
        });
    it('CREATE should add an order with status active',async ()=>{
        const order= await store.create(user.id as unknown as number)
        expect(order.id).toBe(1)
        expect(order.status).toBe("active")
        let user_id = user.id as unknown as number;
        let user_id_string = user_id.toString();
        expect(order.user_id.toString()).toBe(user_id_string)
        expect((await store.index(user.id as number)).length).toBe(1);
    })
    it("INDEX should retrieve all orders of the a user with given id",async ()=>{
        const order1= await store.create(user.id as unknown as number)
        const order2= await store.create(user.id as unknown as number)
        const order3= await store.create(user.id as unknown as number)
        const order4= await store.create(user.id as unknown as number)
        expect((await store.index(user.id as number)).length).toBe(5);
    })
    it("SHOW should show order information that has the id provided",async ()=>{
        const new_order :Order =await store.show(user.id as number,1);
        const newest_order :Order =await store.show(user.id as number,5);
        expect(new_order.id).toBe(1)
        expect(new_order.status).toBe("closed")
        expect(newest_order.id).toBe(5)
        expect(newest_order.status).toBe("active")
        let user_id = user.id as unknown as number;
        let user_id_string = user_id.toString();
        expect(new_order.user_id.toString()).toBe(user_id_string)
        expect(newest_order.user_id.toString()).toBe(user_id_string)
    });
    it("SHOW RECENT method should retrieve active order right know",async()=>{
        const recent_order = await store.showRecent(user.id as number) 
        expect(recent_order.status).toBe("active")
        expect(recent_order.id).toBe( (await store.index(user.id as number)).length)
    })
    it("ADD PRODUCT method should add product with right quantity to user's order",async()=>{
        setTimeout(async()=>{
            const order_products=await store.addProduct(5,2,5)
        expect(order_products.id).toBe(1);
        expect(parseInt(order_products.order_id as unknown  as string)).toBe(5)
        expect(order_products.quantity).toBe(5)
        expect(parseInt(order_products.product_id as unknown  as string)).toBe(2)
        },1000)
    })
    it("DELETE should delete order ",async()=>{
        // we created one order in the previous test and four orders in this tests then we expect four orders
        var order_length=(await store.index(user.id as number)).length
        expect((await store.index(user.id as number)).length).toBe(5);
        await store.delete(1)
        //we deleted one order so we expect the orders array length to be 4
        expect((await store.index(user.id as number)).length).toBe(4);
    })
    
})
describe("Order API Endpoints Tests(ALL need token",()=>{
    beforeAll((done)=>{
        request
        .post('/users/signin')
        .send({ username: 'userorder', password: 'password' })
        .end(function (err,res) {
            if (err) return done();
            token=res.body[1]
            cookie=res.header['set-cookie'][0]
            return done();
          });
    })
    it("INDEX route should return all orders",async()=>{
        await request.get('/orders').set('Cookie', [cookie]).then(async(res)=>{     
            const orders_length=res.body['order'].length
            expect(orders_length).toBe(4)
        })
    })
    it("SHOW route should return the order info that has the id provided",async()=>{
        await request.get('/orders/show/7/2').set('Cookie', [cookie]).then(async(res)=>{     
            const order=res.body
            expect(order.id).toBe(2)
            expect(order.user_id).toBe('7')
            expect(order.status).toBe("closed")
            
        })
    })
    it("SHOWRECENT route should return the recent order info that has the id provided",async()=>{
        await request.get('/orders/recent/7').set('Cookie', [cookie]).then(async(res)=>{     
            const order=res.body
            expect(order.id).toBe(5)
            expect(order.user_id).toBe('7')
            expect(order.status).toBe("active")
            
        })
    })
    it("CREATE route should add order  to the logged in user",async()=>{
        await request.post('/orders/create').set('Cookie', [cookie])
        .then(async(res)=>{     
            const order=res.body
            expect(order.id).toBe(6)
            expect(order.user_id).toBe('7')
            expect(order.status).toBe("active")        
        })
    })
    it("ADD PRODUCT route should add order  to the logged in user",async()=>{
        await request.post('/orders/6/products').set('Cookie', [cookie]).send({product_id:2,quantity:2})
        .then(async(res)=>{     
            const order_product=res.body
            expect(order_product.product_id).toBe('2')
            expect(order_product.order_id).toBe('6')
            expect(order_product.quantity).toBe(2)
        })
    })
    it("DELETE route should deleted order  of the logged in user",async()=>{
        await request.post('/orders/delete').set('Cookie', [cookie]).send({id:2})
        .then(async(res)=>{     
            const order=res.body
            expect(order.id).toBe(2)
            expect(order.user_id).toBe('7')
            expect(order.status).toBe("closed")        
            expect((await store.index(7)).length).toBe(4);
        })
    })

})