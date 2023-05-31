const express = require('express')
const app = express()
const cors = require('cors')
const {MongoClient, ObjectId, Collection} = require('mongodb')
require('dotenv').config()
const PORT = 3000

let db,
    dbConnectionStr = process.env.DB_STRING
    dbName = 'sample_mlfix',
    collection

MongoClient.connect(dbConnectionStr)
    .then(client => {
        console.log(`Connected to database`)
        db = client.db(dbName)
        collection = db.collection('movies')
    })

app.use(express.urlencoded({extended : true}))
app.use(express.json())
app.use(cors())

app.get("/search", async (request,response) => {
    try{
        let result = await collection.aggregate([
            {
                "$Search" : {
                    "autocomplete": {
                        "query": `${request.query.query}`,
                        "path": "title",
                        "fuzzy": {
                            "maxEdits":2,
                            "prefixlength": 3
                        }   
                    }
                }
            }
        ]).toArray()
        response.send(result)
    } catch (error) {
        response.status(500).send({message: error.message})

    }
})

app.get("/get/:id", async (request, response) => {
    try {

    } catch {

    }
}
)

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running.`)
})
