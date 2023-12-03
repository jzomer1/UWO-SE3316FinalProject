const User = require('../models/user');
const { hashPassword, comparePasswords } = require('../helpers/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
            return res.status(400).json({
                error: 'email is already in use'
            });
        }

        const hashedPassword = await hashPassword(password)
        const user = await User.create ({
            email, nickname, password: hashedPassword
        })

        return res.status(201).json(user);
    } catch (error) {
        console.error('Error during user signup:', error);
        return res.status(500).json({
            error: 'Internal Server Error'
        });
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
            jwt.sign({email: user.email, id: user._id, nickname: user.nickname}, process.env.JWT_SECRET, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(user)
            })
            // res.json('passwords match')
        } else {
            res.json({
                error: 'passwords do not match'
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 12);
  
      user.password = hashedPassword;
      await user.save();
  
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

const getProfile = (req, res) => {
    const {token} = req.cookies
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if (err) throw err;
            res.json(user);
        })
    } else {
        res.json(null)
    }
}

module.exports = {
    test,
    userSignup, 
    userLogin,
    getProfile,
    changePassword
}
