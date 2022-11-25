const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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
    const ProductsCollection = client
      .db("ResaleStore")
      .collection("ProductsData");
    const usersCollection = client.db("ResaleStore").collection("users");
    const blogCollection = client.db("ResaleStore").collection("blogs");
    const bookingCollection = client.db("ResaleStore").collection("booking");

    app.get("/categories", async (req, res) => {
      const query = {};
      const categories = await ProductsCollection.find(query).toArray();

      res.send(categories);
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
        // varified: true
      };
      const categorie = await ProductsCollection.find(query).toArray();

      res.send(categorie);
    });

    // save user to db

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

   

    // sellers
    app.get("/dashboard/:seller", async (req, res) => {
        const seller = req.params.seller;
        console.log(seller);
        const query = {
        role: seller,
        };
        const users = await usersCollection.find(query).toArray();
  
        res.send(users);
      });
   
   /// all buyers
      app.get("/dashboard/:buyer", async (req, res) => {
        const buyer = req.params.buyer;
        console.log(buyer);
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
        console.log(email);
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
