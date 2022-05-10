import { Product ,ProductStore } from "../models/product";
import app from '../server';
import supertest from 'supertest';
import {token,cookie} from "./__userSpec"
const store = new ProductStore()
const request = supertest(app);
describe("ProductModel Tests",()=>{
    const product :Product={
        name: "testproduct",
        price :23
    }
    it('should have an index method', () => {
        expect(store.index).toBeDefined();
        });
    it('should have a create method', () => {
    expect(store.create).toBeDefined();
        });
    it('should have a update method', () => {
        expect(store.update).toBeDefined();
        });
    it('should have a delete method', () => {
        expect(store.delete).toBeDefined();
        });
    it('CREATE should create a product with the correct info',async ()=>{
        const new_product=await store.create(product)
        expect(new_product.id).toBe(1)
        expect(new_product.name).toBe("testproduct")
        expect(new_product.price).toBe(23)
    });     
    it("INDEX shoud retrieve all products (4 products) in the database",async ()=>{
        await store.create(product);
        await store.create(product);
        await store.create(product);
        // we created one product in the previous test and three products in this tests then we expect four products
        expect((await store.index()).length).toBe(4);
    });
    it("SHOW should show product information that has the id provided",async ()=>{
        const new_product :Product =await store.show(1);
        expect(new_product.id).toBe(1)
        expect(new_product.name).toBe("testproduct")
        expect(new_product.price).toBe(23)
    });
    it("UPDATE should update the product info correctly",async ()=>{
        const name = "newproductname"
        const price=26  
        //updating product with id number 1
        const updated_product=await store.update(name,price,1)
        expect(updated_product.name).toBe("newproductname")
        expect(updated_product.price ).toBe(26)
    });
    it("DELETE should delete product ",async()=>{
        // we created one product in the previous test and three products in this tests then we expect four products
        expect((await store.index()).length).toBe(4);
        await store.delete(1)
        //we deleted one product so we expect the products array length to be 3
        expect((await store.index()).length).toBe(3);
    })
})
describe("Product API Endpoints Tests",()=>{
    const product:Product={
        name:"testproduct",
        price:35
    }

    describe("API endpoints that does not need token",()=>{
        it("INDEX route should return all products",async()=>{
            await request.get('/products').then(async(res)=>{
                const products_count=(res.body).length
                expect(products_count).toBe(3)
            })
        })
        it("SHOW route should return product info with the same id provided",async()=>{
            await request.get('/products/show/3').then(async(res)=>{           
                const product=await store.show(3)
                expect(product.name).toBe(res.body.name)
                expect(product.price).toBe(res.body.price)
            })    
        })
    })
    describe("API endpoints that does need token",()=>{   

        it("CREATE route should add new product and respond with a the new product",async()=>{
            await request.post('/products/create').send({name:"productname",price:29}).set('Cookie', [cookie])
            .then(async (res)=>{
                let new_product:Product=res.body.new_product
                expect(new_product.name).toEqual("productname")
                expect(new_product.price).toEqual(29)
                expect( (await store.index()).length).toEqual(4)
            })
        })
        it("UPDATE route should update  product and respond with a the updated product",async()=>{
            await request.post('/products/update/5').send({name:"productnamenew",price:25}).set('Cookie', [cookie])
            .then(async (res)=>{
                let updated_product:Product=res.body.updated_product
                expect(updated_product.name).toEqual("productnamenew")
                expect(updated_product.price).toEqual(25)
                expect( (await store.index()).length).toEqual(4)
            })
        })
        it("DELETE route should delete product and respond with a the deleted product",async()=>{
            await request.post('/products/delete').send({id:4}).set('Cookie', [cookie])
            .then(async ()=>{
                expect( (await store.index()).length).toEqual(3)
            })
        })
        
    })
})
