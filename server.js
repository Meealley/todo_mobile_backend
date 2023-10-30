const express = require('express');
const dotenv = require('dotenv').config();
const morgan = require('morgan');
const colors = require('colors');
const PORT =  process.env.PORT || 5000;
const connectDB = require('./Config/dbConnect')


connectDB();


const app = express();
app.use(morgan('dev'));
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.get('/api', (req, res) =>{
    res.json({
        message : "Welcome to getting the todo app"
    })
})


app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})