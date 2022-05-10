import { User ,UserStore } from "../models/user";
import app from '../server';
import supertest from 'supertest';
//@ts-ignore
const store = new UserStore()
const request = supertest(app);
let token :string;
let cookie :string;
describe("User Model Tests",()=>{
    const user:User={
        username : "user1",
        first_name:"firstname",
        last_name:"lastname",
        password :"password",
        email :"email"
    }
    const user2:User={
        username : "user2",
        first_name:"firstname",
        last_name:"lastname",
        password :"password",
        email :"email"
    }
    const user3:User={
        username : "user3",
        first_name:"firstname",
        last_name:"lastname",
        password :"password",
        email :"email"
    }
    const user4:User={
        username : "user4",
        first_name:"firstname",
        last_name:"lastname",
        password :"password",
        email :"email"
    }
    it('should have an index method', () => {
        expect(store.index).toBeDefined();
        });
    it('should have a show method', () => {
        expect(store.show).toBeDefined();
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
     it('CREATE should create a user with the correct info',async ()=>{
        const new_user=await store.create(user)
        expect(new_user.id).toBe(1)
        expect(new_user.username).toBe("user1")
        expect(new_user.first_name).toBe("firstname")
        expect(new_user.last_name).toBe("lastname")
        expect(new_user.email).toBe("email")
    });
    it("INDEX shoud retrieve all users (4 users) in the database",async ()=>{
        const new_user=await store.create(user);
        const new_user2=await store.create(user2);
        const new_user3=await store.create(user3);
        // we created one user in the previous test and three users in this tests then we expect four users
        expect((await store.index()).length).toBe(4);
    });
    it("SHOW should show user information that has the id provided",async ()=>{
        const user :User =await store.show(1);
        expect(user.id).toBe(1)
        expect(user.username).toBe("user1")
        expect(user.first_name).toBe("firstname")
        expect(user.last_name).toBe("lastname")
        expect(user.email).toBe("email")
    });
    it("UPDATE should update the user info correctly",async ()=>{
        const username = "newusername"
        const first_name="newfirst"
        const last_name="newlast"
        const password ="newpass"
        const email ="newemail"
        //updating user with id number 1
        const updated_user=await store.update(username,first_name,last_name,email,password,1)
        expect(updated_user.username).toBe("newusername")
        expect(updated_user.first_name ).toBe("newfirst")
        expect(updated_user.last_name).toBe("newlast")
        expect(updated_user.email).toBe("newemail")
    });
    it("DELETE should delete user ",async()=>{
        // we created one user in the previous test and three users in this tests then we expect four users
        expect((await store.index()).length).toBe(4);
        await store.delete(1)
        //we deleted one user so we expect the users array length to be 3
        expect((await store.index()).length).toBe(3);
    })
})
describe("User API ENDPOINTS Tests ",()=>{
    const user:User={
        username : "user1",
        first_name:"firstname",
        last_name:"lastname",
        password :"password",
        email :"email"
    }
    
    describe("API endpoints that does not need token",()=>{
        it("Sign in route should provide token with user info",(done)=>{
            const new_user= store.create(user).then(()=>{
                request.post('/users/signin').send({username:user.username,password:user.password})
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    //
                    expect(res.body[0].username).toEqual("user1")                
                    if (err) return done();
                    return done();
                });
            })
        })
    })
    describe("API endpoints that  need token",()=>{
        
        //Every post request we will provide a token with it
        beforeAll((done)=>{
            request
            .post('/users/signin')
            .send({ username: 'user1', password: 'password' })
            .end(function (err,res) {
                if (err) return done();
                token=res.body[1]
                cookie=res.header['set-cookie'][0]
                return done();
              });
        })
        it("CREATE route should add new user and respond with a token",async()=>{
            expect((await store.index()).length).toBe(4);
            request.post('/users/create').send({username:"usertest1",first_name:"name1",last_name:"name2",password:"123456",email:"email@email.com",token:token})
            .end(async (err,res)=>{
                const new_user:User=res.body.user
                console.log(new_user)
                expect(new_user.username).toBe("usertest1")
                expect(new_user.first_name).toBe("name1")
                expect(new_user.last_name).toBe("name2")
                expect(new_user.email).toBe("email@email.com")
                expect(res.body.token).toBeDefined()
                expect((await store.index()).length).toBe(5);
                if(err) console.log('err')
            })
        })
        it("UPDATE route should add new user and respond with the new user info",async()=>{
            setTimeout(()=>{
                request.post('/users/update/2').send({username:"usertest1",first_name:"name1",last_name:"name2",password:"123456",email:"email@email.com",token:token})
                .end(async (res)=>{
                expect(res.body.username).toBe("usertest1")
                expect(res.body.first_name).toBe("name1")
                expect(res.body.last_name).toBe("name2")
                expect(res.body.email).toBe("email@email.com")
            })
            },1000)
        })
        it("SHOW route shoud return user info with a certain id",async()=>{
            await request.get('/users/show/6').set('Cookie', [cookie])
            .then(async(res)=>{
                const user1=await res.body
                expect(user1).toBeDefined()
                expect(user1.username).toBe("usertest1")
                expect(user1.first_name).toBe("name1")
                expect(user1.last_name).toBe("name2")
                expect(user1.email).toBe("email@email.com")
            })
            
        })
        it("INDEX route shoud return all users info ",async()=>{
            await request.get('/users').set('Cookie', [cookie])
            .then(async(res)=>{
                const users:User[]=res.body.users
                expect(users.length).toBe(5)
            })
            
        })
        it("DELETE route shoud delete user with id provided and return deleted user ",async()=>{
            const users:number= (await store.index()).length;
            await request.post('/users/delete').set('Cookie', [cookie]).send({id:3})
            .then(async(res)=>{
                expect((await store.index()).length).toBe(users-1)                
            })
            
        })

    })
    
})
export {
    token,cookie
}