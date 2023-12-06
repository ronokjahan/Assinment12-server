const express = require('express')
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
const port = 3000



const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PSS_DB}@cluster0.v8fkcik.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("bistroDb").collection("menu");
    const databases=client.db("bistroDb").collection("revews")
    const cartdata=client.db("bistroDb").collection("carts")
    
    app.get('/menu',async(req ,res)=>{
        const result=await database.find().toArray()
        res.send(result)
    })
    app.get('/revews',async(req ,res)=>{
        const result=await databases.find().toArray()
        res.send(result)
    })

    app.get('/carts',async(req,res)=>{
      const email=req.query.email
      if(!email){
        res.send([])

      }
      const query = { email: email };
      const result=await cartdata.find(query).toArray()
      res.send(result)

    })
    app.post('/carts',async(req,res)=>{
      const item=req.body
      console.log(item);
      const result=await cartdata.insertOne(item)
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})