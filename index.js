const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const app = express();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;

// middleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gfvdc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("products");
        const productCollection = database.collection("allProducts");
        const orderCollection = database.collection("allOrders")
        const reviewCollection = database.collection("allreviews")
        const blogCollection = database.collection("allBlogs")
        const userCollection = database.collection("allUser")

        
         //    post packege api

         app.post('/product', async (req, res) => { 
            const data = req.body;
            const result = await productCollection.insertOne(data);
            res.json(result);
        })

        //  get product api

        app.get('/product', async (req, res) => {
            const cursor = productCollection.find({});
            const data = await cursor.toArray();
            res.send(
                data
            );
        })

        // get singel product

        app.get('/singleproduct/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.findOne(query);
            res.send(result);
        })

        // delete product

        app.delete('/deleteProduct/:id', async(req,res)=>{
            const id = req.params.id;
            const order = {_id: ObjectId(id)};
            const result = await productCollection.deleteOne(order);
            res.send(result);
        })
        // post order api

        app.post('/order' , async(req,res)=>{
            const data = req.body;
            const result = await orderCollection.insertOne(data);
            res.send(result);
        })

        // get order api

        app.get('/allorder', async (req, res) => {
            const cursor = orderCollection.find({});
            const data = await cursor.toArray();
            res.send(
                data
            );
        })

        // post review api

        app.post('/review', async (req, res) => { 
            const data = req.body;
            const result = await reviewCollection.insertOne(data);
            res.json(result);
        })

        //  get review api

        app.get('/review', async (req, res) => {
            const cursor = reviewCollection.find({});
            const data = await cursor.toArray();
            res.send(
                data
            );
        })


        // get user order api

        app.get('/order', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const getData = orderCollection.find(query);
            const result = await getData.toArray();
            res.send(result);
        })

        //  delete order

        app.delete('/deleteOrder/:id', async(req,res)=>{
            const id = req.params.id;
            const order = {_id: ObjectId(id)};
            const result = await orderCollection.deleteOne(order);
            res.send(result);
        })
        //  update status
        app.put('/status/:id', async(req, res)=>{
            const id = req.params.id;
            const order = {_id: ObjectId(id)};
            const updateStatus = {
                $set: {
                    status : "Approved",
                    status2: 'Shipped',
                    color : "#017a38",
                    color2: '#004666',
                    background2: '#0046665b',
                    background : '#017a375e'
                }
            }
            const result = await orderCollection.updateOne(order, updateStatus);
            res.send(result);
        })

        //    post user api

        app.post('/user', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        //   put user api

        app.put('/user', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })

        app.put('/user/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        // get admin api

        app.get('/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.send({ admin: isAdmin });
        })

         //    post blog api

         app.post('/blogs', async (req, res) => { 
            const data = req.body;
            const result = await blogCollection.insertOne(data);
            res.json(result);
        })

        //  get blog api

        app.get('/blogs', async (req, res) => {
            const cursor = blogCollection.find({});
            const data = await cursor.toArray();
            res.send(
                data
            );
        })


    }
    finally {
        //   await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})