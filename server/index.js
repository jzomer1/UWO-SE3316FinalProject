const fs = require('fs');
const path = require('path');
const express = require('express');     // import express module
const app = express();                  // create app object
const port = 3000;                      // define port

// set up serving front-end code (../ moves up one level in directory)
app.use('/', express.static('../client'));

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
function getPublishers(superheroInfo) {
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
        // only add publisher if they aren't in the set
        if (!currentPublishers.has(publisher)) {
            currentPublishers.add(publisher);
            publishers.push(publisher);
        }
    });
    console.log(`Publishers: ${publishers.join(', ')}`);
}

// get the first n number of matching superheros for a given search pattern matching a given information field
function match(field, pattern, n) {
    // filter for matching superheroes
    const matchingSuperheroes = superheroInfo.filter(hero => {
        const fieldValue = hero[field];
        // 'fieldValue && prevents type error if reading incorrect value
        return fieldValue && fieldValue.includes(pattern);
    });

    // case for no defined length or n >= number of matching superheroes
    if (n === undefined || n >= matchingSuperheroes.length) {
        console.log(`Entries that match '${field}: ${pattern}'`);
        matchingSuperheroes.forEach(hero => {
            console.log(`ID: ${hero.id}, Name: ${hero.name}`);
        })
    }
    // case for defined length < number of matching superheroes
    else {
        const matches = matchingSuperheroes.slice(0, n);
        console.log(`${n} entries that match '${field}: ${pattern}'`);
        matches.forEach(hero => {
            console.log(`ID: ${hero.id}, Name: ${hero.name}`);
        })
    }
}

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
    res.json(powers)
})

// start the app by calling the listen method
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

const superheroName = '3-D Man'
const fieldSearch = ['Race', 'Human', 2];

getPowers(superheroName, superheroPowers);
getPublishers(superheroInfo);
// uses spread operator to split into individual elements
match(...fieldSearch);
