const express = require('express')
const app = express()
const PORT = 3000
const Redis = require('redis')
const client = Redis.createClient()
const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))

client.connect().then(() => {
    console.log('Redis connected')
})

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.get('/posts/:id', async (req, res) => {
    const { id } = req.params
    var data = await client.get(`posts/${id}`)
    if (data !== null) {
        return res.send(JSON.parse(data))
    }
    data = await fetch('https://jsonplaceholder.typicode.com/posts/' + id)
        .then((response) => response.json())
        .then((json) => {
            return json
        })
    client.setEx(`posts/${id}`, 3600, JSON.stringify(data))
    return res.send(data)
})

app.get('/posts', async (req, res) => {
    var data = await client.get('posts')
    if (data !== null) {
        return res.send(JSON.parse(data))
    }
    data = await fetch('https://jsonplaceholder.typicode.com/posts')
        .then((response) => response.json())
        .then((json) => {
            return json
        })
    client.setEx(`posts`, 3600, JSON.stringify(data))
    return res.send(data)
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
