const fs = require('fs');
const path = require('path');

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
    console.log(`Powers for ${superhero.hero_names}: ${powers.join(', ')}`);
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

// parse JSON files (../ moves up one level in directory)
const superheroPowers = loadJSON('../superheroes/superhero_powers.json');
const superheroInfo = loadJSON('../superheroes/superhero_info.json');

const superheroName = '3-D Man'
getPowers(superheroName, superheroPowers);
getPublishers(superheroInfo);
