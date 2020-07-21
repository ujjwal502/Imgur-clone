const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../keys')
const requireLogin = require('../middleware/requireLogin')

//I tested JWT authentication with the following code
// router.get('/protected',requireLogin, (req, res)=>{
//     res.send('Hello User')
// })


//creating post requests for signup
router.post('/signup', (req, res) => {
    const { name, email, password } = req.body
    if (!email || !name || !password) {
        return res.status(422).json({ error: "Please add all the fields!" })
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "email already exists with that email" })
            }
            //hashing the password by bcrypt
            bcrypt.hash(password, 12)
                .then(hashedpassword => {
                    const user = new User({
                        email,
                        password: hashedpassword,
                        name
                    })
                    user.save()
                        .then(user => {
                            res.json({ message: "saved successfully" })
                        })
                        .catch(err => {
                            console.log(err);
                        })
                })


        })
        .catch(err => {
            console.log(err);
        })
})

//creating post requests for signin and validation
router.post('/signin', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(422).json({ error: 'please add email or password' })
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: 'Invalid Email or Password' })
            }

            //comapring the input passwords from saved password
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        // res.json({ message: 'successfully signed in' })

                        //assigning JWT to the user
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                        res.json({ token })
                    }
                    else {
                        return res.status(422).json({ error: 'Invalid Email or Password' })
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        })
})

module.exports = router