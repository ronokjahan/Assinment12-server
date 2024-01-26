const express = require('express')
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const database = client.db("Chamer").collection("children");
    const enroll = client.db("Enroll").collection("data");
   
    
    app.get('/children',async(req ,res)=>{
        const result=await database.find().toArray()
        res.send(result)
    })
    app.get('/children/:_id',async(req ,res)=>{
      const id=req.params._id
      
      const query={_id:new ObjectId(id)}
      const result=await database.findOne(query)
      res.send(result)
    
      
    })
    app.post("/enroll",async(req,res)=>{
      const query=req.body
      console.log(query);
      const result=await enroll.insertOne(query)
      res.send(result)

    })
    app.get('/enroll',async(req,res)=>{
      const id=enroll.find()
      // let query={}
      // if(req.query?.email){
      //   query={email:req.query.email}
      // }
      const queryss=enroll.find()
      const result=await id.toArray(queryss)
      res.send(result)
    })
    app.get('/enroll/:_id',async(req,res)=>{
      const id=req.params._id
      const query={_id:new ObjectId(id)}
      const result=await  enroll.findOne(query)
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