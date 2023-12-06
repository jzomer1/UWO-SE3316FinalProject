require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');

const runSetup = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('Admin user already exists.');
      return;
    }

    const saltRounds = 10;
    const adminPassword = 'qwerty';
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    const adminUser = new User({
      email: 'admin@example.com',
      nickname: 'ADMIN',
      password: hashedPassword,
      isAdmin: true,
    });

    await adminUser.save();
    console.log('Admin created');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

runSetup();

// node adminSetup.js to add admin