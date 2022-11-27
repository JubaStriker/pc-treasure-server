const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require("dotenv").config()
const app = express();

app.use(cors())
app.use(express.json());


const uri = process.env.DB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const productsCollection = client.db('pcTreasure').collection('products');
        const bookingsCollection = client.db('pcTreasure').collection('bookings');
        const usersCollection = client.db('pcTreasure').collection('users');
        const allProductsCollection = client.db('pcTreasure').collection('allProducts');
        const advertisementsCollection = client.db('pcTreasure').collection('advertisement');


        app.get('/allproducts', async (req, res) => {
            const query = {};
            const products = await allProductsCollection.find(query).toArray();
            res.send(products);
        })

        app.get('/allproducts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { category: id };
            const category = await allProductsCollection.find(query).toArray();
            res.send(category);
        })

        app.get('/myproducts', async (req, res) => {
            const email = req.query.email;
            const query = { sellerEmail: email }
            const result = await allProductsCollection.find(query).toArray();
            res.send(result);
        })

        app.delete('/myproducts/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const result = await allProductsCollection.deleteOne(filter)
            res.send(result)
        })

        app.post('/allproducts', async (req, res) => {
            const product = req.body;
            const result = await allProductsCollection.insertOne(product);
            res.send(result);
        })

        app.get('/products', async (req, res) => {
            const query = {};
            const products = await productsCollection.find(query).toArray();
            res.send(products);
        })

        app.get('/category/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const category = await productsCollection.find(query).toArray();
            res.send(category);
        })

        app.post('/advertisement', async (req, res) => {
            const products = req.body;
            console.log(products);
            const query = {
                name: products.name,
                sellerEmail: products.sellerEmail
            };
            const alreadyAdvertised = await advertisementsCollection.find(query).toArray();
            if (alreadyAdvertised.length) {
                const message = 'Product already advertised'
                return res.send({ acknowledged: false, message: message })
            }
            const result = await advertisementsCollection.insertOne(products);
            res.send(result);
        })

        app.get('/advertisement', async (req, res) => {
            const query = {};
            const advertisements = await advertisementsCollection.find(query).toArray();
            res.send(advertisements);
        })



        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = usersCollection.insertOne(user);
            res.send(result);
        })

        app.post('/gusers', async (req, res) => {
            const user = req.body;
            const query = {
                email: user.email
            }

            const alreadyUser = await usersCollection.find(query).toArray();
            if (alreadyUser.length) {
                const message = 'Items already advertised'
                return res.send({ acknowledged: false, message: message })
            }
            const result = usersCollection.insertOne(user);
            res.send(result);
        })


        app.post('/bookings', async (req, res) => {
            const booking = req.body
            const query = {
                product: booking.product,
                email: booking.email
            }

            const alreadyBooked = await bookingsCollection.find(query).toArray();
            if (alreadyBooked.length) {
                const message = `You have already booked ${booking.product}`
                return res.send({ acknowledged: false, message: message })
            }

            const result = await bookingsCollection.insertOne(booking)
            res.send(result)
        })

        app.get('/bookings', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const bookings = await bookingsCollection.find(query).toArray();
            res.send(bookings)
        })
        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const result = await bookingsCollection.deleteOne(filter)
            res.send(result)
        })



    }
    finally {

    }
}

run().catch(console.log);

app.get('/', async (req, res) => {
    res.send("pc treasure server running")
});

app.listen(port, () => {
    console.log(`pc treasure server running on port ${port}`);
});