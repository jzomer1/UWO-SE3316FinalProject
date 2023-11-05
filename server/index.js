const fs = require('fs');
const path = require('path');

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

// get the first n number of matching superheros for a given search pattern matching a given information field
function match(field, pattern, n){
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

const superheroName = '3-D Man'
const fieldSearch = ['Race', 'Human', 2];

getPowers(superheroName, superheroPowers);
getPublishers(superheroInfo);
// uses spread operator to split into individual elements
match(...fieldSearch);
