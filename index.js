const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { default: Stripe } = require("stripe");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.db_users}:${process.env.db_password}@cluster0.fvyg8ej.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    //clirnt connect
    const ProductsCollection = client.db("ResaleStore").collection("ProductsData");
    const usersCollection = client.db("ResaleStore").collection("users");
    const blogCollection = client.db("ResaleStore").collection("blogs");
    const bookingCollection = client.db("ResaleStore").collection("booking");


// get all advertised
    app.get("/alladvertise", async (req, res) => {
      const query = { payment_status: true};
      const categories = await ProductsCollection.find(query).toArray();

      res.send(categories);
    });


    // payment data 

    // app.get("/payment/:booking_id", async (req, res) => {
    //   const id = req.params.booking_id;
    //   const query = { _id: id};
    //   const categories = await ProductsCollection.find(query).toArray();

    //   res.send(categories);
    // });
    app.get("/myorders/payments/:booking_id", async (req, res) => {
      const booking_id = req.params.booking_id
      const query = { _id: ObjectId(booking_id)};
      // console.log(booking_id);
      const cursor = await ProductsCollection.findOne(query);
      // const rsult =  toArray(cursor);

      res.send(cursor);
    });



    app.get("/blog", async (req, res) => {
      const query = {};
      const categories = await blogCollection.find(query).toArray();

      res.send(categories);
    });

    app.get("/:brand", async (req, res) => {
      const brand = req.params.brand;
      const query = {
        brand: brand,
        isApproved: true
      };
      const categorie = await ProductsCollection.find(query).toArray();

      res.send(categorie);
    });



    // approve post put 
    app.put('/dashboard/approvedrequest/:id', async(req,res)=>{
      const id = req.params.id;
      const filter = {_id : ObjectId(id)};
      const options = {upsert: true};
      const updateddoc = {
          $set:{
              isApproved: true
          }
      }
      const result = await ProductsCollection.updateOne(filter,updateddoc,options);
      res.send(result) ;
    })




    // delete sellers user 
   
    app.delete('/dashbord/seller/:user_uid', async (req,res)=>{
      const id = req.params.user_uid;
      const filter = {user_uid : id};
      const result = await usersCollection.deleteOne(filter);
     
      res.send(result);

    });

    //delete buyer 
    app.delete('/dashbord/buyer/:id', async (req,res)=>{
      const id = req.params.id;
      const filter = {_id : ObjectId(id)};
      const result = await usersCollection.deleteOne(filter);
     
      res.send(result);

    });



    // my oders delete 
    app.delete('/dashboard/myorderdelete/:id', async (req,res)=>{
      const id = req.params.id;
      const query = {_id : ObjectId(id)};
      const result = await bookingCollection.deleteOne(query);
     
      res.send(result);

    })

    // delete sellers products
    app.delete('/dashbord/product/:user_uid', async (req,res)=>{
      const id = req.params.user_uid;
      const filter = {user_uid : id};
      const result = await ProductsCollection.deleteMany(filter);
     
      res.send(result);

    });

    // delete my orders

    app.delete('/dashboard/productsdelete/:id', async (req,res)=>{
      const id = req.params.id;
      const filter = {_id : ObjectId(id)};
      const result = await ProductsCollection.deleteOne(filter);
     
      res.send(result);

    })

    // booking data 
    app.get('/dashboard/bookings', async (req,res)=>{
      const email = req.query.email;
      // const decodedEmail = req.decoded.email;
      // console.log(email,decodedEmail);
      // if(email !== decodedEmail){
      //     return res.status(403).send({message:'forbidden access'})
      // }
      const query = {email: email};
      const bookings = await bookingCollection.find(query).toArray();
      res.send(bookings);
  });


    // sellers verified

    app.put('/dashboard/users/admin/:id', async(req,res)=>{
      const id = req.params.id;
      const filter = {user_uid : id};
      const options = {upsert: true};
      const updateddoc = {
          $set:{
              isVarified: true
          }
      }
      const result = await usersCollection.updateOne(filter,updateddoc,options);
      res.send(result) ;
    })


    // user vrified
    app.put('/dashboard/userverified/admin/:id', async(req,res)=>{
      const id = req.params.id;
      const filter = {user_uid : id};
      const options = {upsert: true};
      const updateddoc = {
          $set:{
              isVarified: true
          }
      }
      const result = await ProductsCollection.updateOne(filter,updateddoc,options);
      res.send(result) ;
    });

    // Advertise products
    app.put('/dashboard/advertise/:id', async(req,res)=>{
      const id = req.params.id;
      // console.log(id);
      const filter = {_id : ObjectId(id)};
      const options = {upsert: true};
      const updateddoc = {
          $set:{
            payment_status: true,
            advertiseBtn : true
          }
      }
      const result = await ProductsCollection.updateOne(filter,updateddoc,options);
      res.send(result) ;
    });

    // add to reported
    app.put('/dashboard/reported/:id', async(req,res)=>{
      const id = req.params.id;
      // console.log(id);
      const filter = {_id : ObjectId(id)};
      const options = {upsert: true};
      const updateddoc = {
          $set:{
            reported: true,
          
          }
      }
      const result = await ProductsCollection.updateOne(filter,updateddoc,options);
      res.send(result) ;
    }); 

    // get wishlist

    app.get('/dashboard/reported/', async (req,res)=>{
     
      const query = {reported: true};
      const report = await ProductsCollection.find(query).toArray();
      res.send(report);
  });

    // get advertise
    // app.get('/alladvertise',async(req,res)=>{
     
     
    //   const query= {};
    //   const cursor =await ProductsCollection.find(query).toArray();
    //   console.log(query);
    //   res.send(cursor)
    // });




    //add products

    app.post('/products',async(req,res)=>{
      const product = req.body;
      const result = await ProductsCollection.insertOne(product);
      res.send(result);
    })
  
       //my orders

    app.get('/dashboard/myproducts', async (req,res)=>{
      const email = req.query.email;
      const query = {email :email};
      const product = await ProductsCollection.find(query).toArray();
     
      res.send(product);
  });

  // approved request
    app.get('/dashboard/approvedpost', async (req,res)=>{
    
      const query = {isApproved :false};
      const product = await ProductsCollection.find(query).toArray();
     
      res.send(product);
  });



    // save user to db   

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });


    // get all user 

    app.get("/allusers", async (req, res) => {
      const query = {};
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });

    // sellers
    app.get("/dashboard/:seller", async (req, res) => {
        const seller = req.params.seller;
        //  console.log(seller);
        const query = {
        role: seller,
        };
        const users = await usersCollection.find(query).toArray();
  
        res.send(users);
      });
   
   /// all buyers
      app.get("/dashboard/:buyer", async (req, res) => {
        const buyer = req.params.buyer;
        // console.log(buyer);
        const query = {
        role: buyer,
        };
        const users = await usersCollection.find(query).toArray();
  
        res.send(users);
      });

    // addmin

    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isAdmin: user?.role === "admin" });
    });

    // sellers 
    app.get("/users/sellers/:email", async (req, res) => {
        const email = req.params.email;
        // console.log(email);
        const query = { email };
        const user = await usersCollection.findOne(query);
        res.send({ isSellers: user?.role === "seller" });
      });

        // buyers 
    app.get("/users/buyers/:email", async (req, res) => {
        const email = req.params.email;
      
        const query = { email };
        const user = await usersCollection.findOne(query);
        res.send({ isBuyers: user?.role === "buyer" });
      });

    // booking data
    app.post("/booking", async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });

    app.get("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const singleBlog = await blogCollection.findOne(query);

      res.send(singleBlog);
    });

    // app.post('/totalpayment/payments',async(req,res)=>{
    //   const booking =  req.body;
    //   const price = booking.price;
    //   const amount = price*100;
    //   const paymentIntent = await  Stripe.paymentIntent.create({
    //     currency: 'usd',
    //     amount : amount,
    //     "payment_method_tipes":[
    //       "card"
    //     ]

    //   });
    //   res.send({
    //     clientSecret: paymentIntent.client_secret,
    //   })
    // });

    app.post('/create-payment-intent', async (req, res) => {
      const booking = req.body;
      const price = booking.price;
      const amount = price * 100;

      const paymentIntent = await stripe.paymentIntents.create({
          currency: 'usd',
          amount: amount,
          "payment_method_types": [
              "card"
          ]
      });
      res.send({
          clientSecret: paymentIntent.client_secret,
      });
  });

    

  } catch {
    console.error(error);
  }
}
run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("resale server is running");
});

app.listen(port, () => {
  console.log(`Resale server is running on ${port}`);
});
