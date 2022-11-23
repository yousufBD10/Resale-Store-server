const express = require('express');
const cors = require('cors');


require('dotenv').config();

const app = express();
const port= process.env.PORT || 5000;

// middle ware
app.use(cors());
app.use(express.json());




async function run(){
    try{
       //clirnt connect
      

         
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