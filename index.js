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
        const categoriesCollection = client.db('pcTreasure').collection('categories');
        const graphicsCardsCollection = client.db('pcTreasure').collection('graphicsCard');
        const mouseCollection = client.db('pcTreasure').collection('mouse');
        const ramCollection = client.db('pcTreasure').collection('ram');


        app.get('/products', async (req, res) => {
            const query = {};
            const products = await productsCollection.find(query).toArray();
            res.send(products);
        })

        app.get('/categories', async (req, res) => {
            const query = {};
            const categories = await categoriesCollection.find(query).toArray();
            res.send(categories);
        })

        app.get('/graphicscards', async (req, res) => {
            const query = {};
            const graphicsCards = await graphicsCardsCollection.find(query).toArray();
            res.send(graphicsCards);
        })

        app.get('/mouses', async (req, res) => {
            const query = {};
            const mouses = await mouseCollection.find(query).toArray();
            res.send(mouses);
        })

        app.get('/rams', async (req, res) => {
            const query = {};
            const rams = await ramCollection.find(query).toArray();
            res.send(rams);
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