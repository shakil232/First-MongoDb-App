const express = require('express');
const bodyParser = require('body-parser');
// const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const pass = "oZNgbdJuVaTlPvjg";

const uri = "mongodb+srv://expressUser:oZNgbdJuVaTlPvjg@cluster0.9cu5v.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
// app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})




client.connect(err => {
    const ProductCollection = client.db("organicdb").collection("products");
    
    app.get('/products', (req,res)=>{
        ProductCollection.find({})
        .toArray((err , documents)=>{
            res.send(documents)
        })
    })
    
    app.get('/product/:id', (req , res)=>{
        ProductCollection.find({_id: ObjectID(req.params.id)})
        .toArray((err , documents)=>{
            res.send(documents[0])
        })
    })

    app.post('/addProduct', (req, res) => {
        const product = req.body;
        ProductCollection .insertOne(product)
            .then(result => {
                console.log('addProduct')
                res.redirect('/')
            })
    })
    app.patch( '/update/:id', (req , res) => {
        ProductCollection.updateOne({_id: ObjectID(req.params.id)},
        {
            $set: {price: req.body.price, quantity: req.body.quantity}
        }
        )
        .then( result =>{
            res.send(result.modifiedCount > 0)
        })
    })
    app.delete('/delete/:id', (req, res)=>{
        ProductCollection.deleteOne({_id: ObjectID(req.params.id)})
       .then( result=>{
           res.send(result.deletedCount > 0) ;
       })
    })

    console.log('database connect')

});


app.listen(4000, () => {
    console.log('server listening on port 4000')
})