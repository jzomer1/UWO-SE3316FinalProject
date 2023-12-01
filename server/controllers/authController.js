const User = require('../models/user')
const { hashPassword, comparePasswords } = require('../helpers/auth')

const test = (req, res) => {
    res.json('test works')
}

const userSignup = async (req, res) => {
    try {
        const {email, nickname, password} = req.body;
        // ensure nickname was entered
        if (!nickname) {
            return res.json ({
                error: 'nickname is required'
            });
        }
        // check password
        if (!password || password.length < 5) {
            return res.json ({
                error: 'password is required and must be at least 5 characters'
            });
        }
        // check email
        const exist = await User.findOne({email})
        if (exist) {
            return res.json ({
                error: 'email is already in use'
            })
        }

        const hashedPassword = await hashPassword(password)
        const user = await User.create ({
            email, nickname, password: hashedPassword
        })

        return res.json(user)
    } catch (error) {
        console.log(error)
    }
}

const userLogin = async (req, res) => {
    try {
        const {email, password} = req.body;
        // ensure user exists
        const user = await User.findOne({email});
        if (!user) {
            return res.json ({
                error: 'email not registered'
            })
        }
        // ensure password is correct
        const match = await comparePasswords(password, user.password)
        if (match) {
            res.json('passwords match')
        } else {
            res.json({
                error: 'passwords do not match'
            })
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    test,
    userSignup, 
    userLogin
}