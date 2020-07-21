const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 5000
const { MONGOURI } = require('./keys')
const { json } = require('express')


//connecting mongoose
mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected', () => {
    console.log('connected to mongo');
})
mongoose.connection.on('error', (err) => {
    console.log('error in connection', err);
})

//requiring models
require('./models/user')
require('./models/post')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))

//Listening the port
app.listen(PORT, () => {
    console.log('The port is running on 5000');
})

