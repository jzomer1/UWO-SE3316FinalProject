const fs = require('fs');
const path = require('path');
const express = require('express');     // import express module
const app = express();                  // create app object
const port = 3001;                      // define port
require('dotenv').config();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authenticateMiddleware = require('./middlewares/authenticateMiddleware');
const adminMiddleware = require('./middlewares/adminMiddleware');

// import user model
const User = require('./models/user');

// database connection
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Database connected'))
.catch((err) => console.log('Database NOT connected', err));

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(authenticateMiddleware);

// global variable to store favourites lists
let lists = {};

// set up routing
app.use('/', require('./routes/authRoutes'));
app.use('/', require('./routes/usersRoutes'));

// parse JSON files (../ moves up one level in directory)
const superheroPowers = loadJSON('../superheroes/superhero_powers.json');
const superheroInfo = loadJSON('../superheroes/superhero_info.json');

// load JSON located at 'file'
function loadJSON(file) {
    try {
        const filePath = path.join(__dirname, file);
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    }
    catch (error) {
        console.error(`Could not load JSON file ${file}`);
        console.error('Error: ', error.message);
    }
}

// get powers for given superhero ID
function getPowers(heroName, data) {
    // arrow function for finding superhero
    const superhero = data.find(hero => hero.hero_names === heroName);
    // exit with error message if hero name is not found
    if (!superhero) {
        console.log(`${heroName} was not found`);
        return;
    }
    // create array for storing powers
    const powers = [];
    // for loop populates 'True' powers for given hero
    for (const power in superhero) {
        if (superhero[power] === 'True') {
            powers.push(power);
        }
    }
    if (powers.length === 0) {
        console.log(`No powers found for ${superhero.hero_names}`);
    } else {
        console.log(`Powers for ${superhero.hero_names}: ${powers.join(', ')}`);
    }
    return powers;
}

// get all available publisher names
function getPublishers() {
    // exit with error message if JSON file is not found
    if (!superheroInfo) {
        console.log(`${superheroInfo} was not found`);
        return;
    }
    // create array for storing publishers
    const publishers = [];
    // create set for checking if a publisher already exists
    const currentPublishers = new Set();

    // loop to add each publisher
    superheroInfo.forEach(element => {
        const publisher = element.Publisher;
        // only add publisher if they aren't in the set and have a value
        if (!currentPublishers.has(publisher) && publisher.trim() !== '') {
            currentPublishers.add(publisher);
            publishers.push(publisher);
        }
    });
    console.log(`Publishers: ${publishers.join(', ')}`);
    return publishers;
}

// get the first n number of matching superheros for a given search pattern matching a given information field
function match(criteria, n) {
    // filter for matching superheroes
    const matchingSuperheroes = superheroInfo.filter(hero => {
        return Object.entries(criteria).every(([field, pattern]) => {
            const fieldValue = hero[field];
            // 'fieldValue &&' prevents type error if reading incorrect value
            return fieldValue && fieldValue.includes(pattern);
        });
    });
    // case for only when n < number of matching heroes
    if (n < matchingSuperheroes.length) {
        const matches = matchingSuperheroes.slice(0, n);
        return matches;
    }
    // case for no defined length or n >= number of matching superheroes
    else {    
        return matchingSuperheroes;
    }
}

app.get('/match', (req, res) => {
    // implement match() function
    const { name, Race, Publisher, power, n } = req.query;

    const filteredData = superheroInfo.filter((hero) => {
        return (
            (!name || hero.name.toLowerCase().includes(name.toLowerCase())) &&
            (!Race || hero.Race.toLowerCase().includes(Race.toLowerCase())) &&
            (!Publisher || hero.Publisher.toLowerCase().includes(Publisher.toLowerCase())) &&
            (!power || hero.Power.toLowerCase().includes(power.toLowerCase()))
        );
    });
    // if 'n' exists display 'n' results, if 'n' dne display all results
    const slicedData = n && parseInt(n) > 0 ? filteredData.slice(0, parseInt(n)) : filteredData;

    res.json(slicedData);
});

// get all information for given superhero ID
app.get('/superheroes/:id', (req, res) => {
    const heroID = parseInt(req.params.id);
    // find given ID
    const idNumber = superheroInfo.find((hero) => hero.id === heroID);
    // send error code if hero ID is not found
    if (!idNumber) {
        return res.status(404).send(`ID ${req.params.id} was not found`);
    }
    // send JSON response
    res.json(idNumber);
});

// get superhero powers by ID
app.get('/powers/:heroName', (req, res) => {
    const heroName = req.params.heroName;
    // find powers for given hero by calling getPowers() function
    const powers = getPowers(heroName, superheroPowers);
    // send error code if hero ID is not found
    if (!powers) {
        return res.status(404).send(`ID ${req.params.heroName} was not found`);
    }
    // send JSON response
    res.json(powers);
});

// get all publishers
app.get('/publishers', (req, res) => {
    // find publishers by calling getPublishers() function
    const publishers = getPublishers();
    // send error code if publisher list is not found
    if (!publishers) {
        return res.status(404).send(`Publishers were not found`);
    }
    // send JSON response
    res.json(publishers);
});

// create new favourites list
app.post('/lists', (req, res) => {
    const listName = req.body.listName;
    if (!listName) {
        // 400 -> bad request
        return res.status(400).send('Please enter list name');
    }
    if (lists[listName]) {
        // 409 -> conflict
        return res.status(409).send('List name already exists');
    }
    lists[listName] = [];
    // 201 -> successful creation of new resource
    res.status(201).send('List created');
});

// save list of IDs
app.put('/lists/:listName', (req, res) => {
    const listName = req.params.listName;
    const heroIds = req.body.heroIds;
    if (!lists[listName]) {
        // 404 -> not found
        return res.status(404).send('List does not exist');
    }
    lists[listName] = heroIds;
    res.send('List updated');
});

// get list of IDs
app.get('/lists/:listName', (req, res) => {
    const listName = req.params.listName;
    const heroIds = lists[listName];
    if (!heroIds) {
        return res.status(404).send('List does not exist');
    }
    res.json(heroIds);
});

// delete list of IDs
app.delete('/lists/:listName', (req, res) => {
    const listName = req.params.listName;
    if (!lists[listName]) {
        return res.status(404).send('List does not exist');
    }
    delete lists[listName];
    res.send('List deleted');
});

// grant admin
app.post('/admin/grant/:email', adminMiddleware, async (req, res) => {
    const { email } = req.params;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.isAdmin = true;
        await user.save();

        res.json({ message: 'Admin privileges granted successfully' });
    } catch (error) {
        console.error('Error granting admin privileges:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// start the app by calling the listen method
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
