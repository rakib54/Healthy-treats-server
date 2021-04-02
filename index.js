const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID

const port = process.env.PORT || 4000

app.use(cors())
app.use(bodyParser.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c4bol.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const ProductCollection = client.db("healthy-treats").collection("products");
    const BuyProductCollection = client.db("healthy-treats").collection("BuyProducts");
    
    app.get('/products', (req, res) =>{
        ProductCollection.find()
        .toArray((err , documents)=>{
            res.send(documents)
        })
    })

    app.post('/buyProduct' , (req , res)=>{
        const BuyProduct = req.body
        BuyProductCollection.insertOne(BuyProduct)
        .then(result =>{
            res.send(result.insertedCount > 0)
        })
        console.log(BuyProduct);
    })
    app.get('/buyProducts', (req, res) =>{
        BuyProductCollection.find({})
        .toArray((err , documents)=>{
            res.send(documents)
        })
    })

    app.post('/addProduct', (req , res) =>{
        const newProduct = req.body
        console.log('Get data' , newProduct);

        ProductCollection.insertOne(newProduct)
        .then(result =>{
            console.log(result.insertedCount);
            res.send(result.insertedCount > 0)
        })
    })

    app.delete('/deleteProduct/:id',(req,res) =>{
        const id = ObjectID(req.params.id)
        ProductCollection.findOneAndDelete({_id: id})
        .then(documents =>{
            res.send(!!documents.value)
        })
    })

    // client.close();
});


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})