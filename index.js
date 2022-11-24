const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();

const app = express();
const port= process.env.PORT || 5000;

// middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.db_users}:${process.env.db_password}@cluster0.fvyg8ej.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run(){
    try{
       //clirnt connect
       const ProductsCollection = client.db('ResaleStore').collection('ProductsData');

         
       app.get('/categories', async (req,res)=>{
        const query = {}
        const categories =await  ProductsCollection.find(query).toArray();;
       
        res.send(categories);
    });
       app.get('/category/:brand', async (req,res)=>{
        const brand = req.params.brand;
        const query = {
            brand:brand
        }
        const categorie =await  ProductsCollection.find(query).toArray();;
       
        res.send(categorie);
    });

    }
    catch{
        console.error(error)
    }


}
run().catch(err=>console.error(err))


app.get('/',(req,res)=>{
    res.send('resale server is running');
})

app.listen(port,()=>{
    console.log(`Resale server is running on ${port}`);
})