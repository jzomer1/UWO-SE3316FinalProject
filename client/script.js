// div that displays search results
const searchResults = document.getElementById('searchResults');
// global variable to store favourites lists
let lists = {};
// global list to store users
let users = [];

// styling for search results
function addBoxShadow(data) {
    data.classList.add('box-shadow-effect');
}

// create user account
function createAccount() {
    const email = document.getElementById('email');
    const nickname = document.getElementById('nickname');
    const password = document.getElementById('password');

    const emailValue = email.value;
    const nicknameValue = nickname.value;
    const passwordValue= password.value;

    // input validation for email
    if (!emailValidation(emailValue)) {
        alert('Invalid email. Please try again');
        email.focus();
        return;
    }
    // check if email is already in use
    if (users.some(user => user.emailValue === emailValue)) {
        alert('Email already in use. Please try another one');
        email.focus();
        return;
    }
    // save user data
    users.push({ emailValue, nicknameValue, passwordValue, verified: false, disabled: false });
    // send verification email
    sendVerificationEmail(emailValue);

    alert('Account created. Please check for verification email');
    swapForms('signup', 'login');
}

function login() {
    const email = document.getElementById('login-email');
    const password = document.getElementById('login-password');

    const emailValue = email.value;
    const passwordValue= password.value;

    // input validation for email
    if (!emailValidation(emailValue)) {
        alert('Invalid email. Please try again');
        email.focus();
        return;
    }

    // check user data
    const user = users.find(user => user.emailValue === emailValue && user.passwordValue === passwordValue);

    // verify user data exists
    if (user) {
        if (!user.verified) {
            alert('Account not verified. Please check your email');
        } else if (user.disabled) {
            alert('Account is disabled. Please contact admin');
        } else {
            alert(`Welcome to Superhero Information, ${user.nicknameValue}`);
            swapForms('login', 'change-password');
            document.getElementById('about').style.display = 'none';
            // add delete button for lists
            var deleteButton = document.getElementsByClassName('deleteList');
            for (var i = 0; i < deleteButton.length; i++) {
                deleteButton[i].style.display = 'inline-block';
            }
        }
    } else {
        alert('Invalid email or password. Please try again')
    }
}

function changePassword() {
    const email = document.getElementById('login-email');
    const newPassword = document.getElementById('new-password');

    const emailValue = email.value;
    const passwordValue= newPassword.value;

    // search users array for given email
    const userIndex = users.findIndex(user => user.emailValue === emailValue);

    // change password if user exists
    if (userIndex !== -1) {
        users[userIndex].passwordValue = passwordValue;
        alert('Password changed');
        swapForms('change-password', 'login');
    } else {
        alert('User not found');
    }
}

function emailValidation(email) {
    /*
    ^           --> start string
    /w+         --> one or more word characters (alphanumeric or '_')
    ([\.-]?\w+)* -> allows '.' or '-' followed by one or more word characters (* allows zero or more times)
    @           --> '@' symbol
    (\.\w{2,3})+ -> '.' followed by one or more word characters, can repeat
    $           --> end of string
    */
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
}

function sendVerificationEmail(email) {
    // not working yet, so just logging for now
    console.log(`Email sent to ${email}`);
}

function swapForms(hide, show) {
    document.getElementById(hide).style.display = 'none';
    document.getElementById(show).style.display = 'block';
}

// main search
async function searchHeroes() {
    try {
        const field = document.getElementById('field').value;
        const pattern = document.getElementById('pattern').value;
        const n = parseInt(document.getElementById('n').value);
    
        const response = await fetch(`/match?field=${field}&pattern=${pattern}&n=${n}`);
        console.log(response);

        const mainSearchResults = document.getElementById('mainSearchResults');
        mainSearchResults.innerHTML = '';

        if (response.ok) {
            const data = await response.json();
            console.log(data);

                if (Array.isArray(data)) {
                    data.forEach(superhero => {
                        const superheroContainer = document.createElement('div');
                        superheroContainer.classList.add('hero-block', 'box-shadow-effect');
                        for (const property in superhero) {
                            if (superhero.hasOwnProperty(property)) {
                                // capitalize first letters, force 'id' to 'ID'
                                const propertyName = (property === 'id') ? 'ID' : property.charAt(0).toUpperCase() + property.slice(1);
                                const propertyDiv = document.createElement('div');
                                propertyDiv.innerHTML = `<b>${propertyName}:</b> ${superhero[property]}`;
                                superheroContainer.appendChild(propertyDiv);
                            }
                        }
                        mainSearchResults.appendChild(superheroContainer);
                        // superheroDiv.classList.add('superhero');
                    });
                } else {
                    
                    mainSearchResults.innerHTML = 'Invalid data format';
                }
            } else {
                
                mainSearchResults.innerHTML = 'Invalid response status: ' + response.status;
            }
            
            
        } catch (error) {
        console.error(`Error searching heroes: ${error}`);
        
        const mainSearchResults = document.getElementById('mainSearchResults');
        mainSearchResults.innerHTML = '';
        mainSearchResults.innerHTML = "Error: " + error.message;
    }
}

function getHeroInfo(id) {
    addBoxShadow(searchResults);

    // const ID = document.getElementById('idForInfo').value;
    const ID = id;

    fetch(`/superheroes/${ID}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`ID ${ID} not found`);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                searchResults.innerHTML = `Error: ${data.error}`;
            } else {
                const content = `<b>ID:</b> ${data.id}<br><b>Name:</b> ${data.name}<br><b>Gender:</b> ${data.Gender}
                <br><b>Eye colour:</b> ${data['Eye color']}<br><b>Race:</b> ${data.Race}<br><b>Hair colour:</b> ${data['Hair color']}
                <br><b>Height:</b> ${data.Height}<br><b>Publisher:</b> ${data.Publisher}<br><b>Skin colour:</b> ${data['Skin color']}
                <br><b>Alignment:</b> ${data.Alignment}<br><b>Weight:</b> ${data.Weight}`;
                searchResults.innerHTML = content;
            }
        })
        .catch(error => {
            console.error(`Error ${error}`);
            searchResults.innerHTML = `Error: ${error.message}`;
        });
}

async function fetchHeroPowers(ID) {
    try {
        const name = await idToName(ID);
        const response = await fetch(`/powers/${name}`);
        
        if (!response.ok) {
            throw new Error(`Powers not found for ${ID}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching powers: ${error}`);
        return [];
    }
}

async function getHeroPowers(ID) {
    addBoxShadow(searchResults);

    try {
        const data = await fetchHeroPowers(ID);
        if (data.length > 0) {
            const name = await idToName(ID);
            const content = `<b>Powers for ${name}:</b> ${data.join(', ')}`;
            searchResults.innerHTML = content;
        } else {
            searchResults.innerHTML = 'No powers found';
        }
    } catch (error) {
        searchResults.innerHTML = `ID: ${ID} is not valid`;
    }
}

async function getHerosPowers(ID) {
    try {
        const data = await fetchHeroPowers(ID);
        return data;
    } catch (error) {
        console.error(`Error fetching powers: ${error}`);
        return [];
    }
}

async function idToName(ID) {
    try {
        const response = await fetch(`/superheroes/${ID}`);
        const data = await response.json();
        console.log('Server response: ', data);
        if (!response.ok) {
            throw new Error(`ID ${ID} not found`);
        }
        return data.name;
    } catch (error) {
        return { error: error.message };
    }
}

async function idsToNames(IDs) {
    try {
        const responses = await Promise.all(IDs.map(async (ID) => {
            try {
                const response = await fetch(`/superheroes/${ID}`);
                if (!response.ok) {
                    throw new Error(`ID ${ID} not found`);
                }
                const data = await response.json();
                console.log('Server response: ', data);
                return { superhero: data };
            } catch (error) {
                console.error(`Error fetching ID ${ID}: ${error.message}`);
                return { error: `ID ${ID} not found` };
            }        
        }));
        return responses;
    } catch (error) {
        console.error(`Error in idToName: ${error.message}`);
        return { error: error.message };
    }
}

function getPublisherList() {
    addBoxShadow(searchResults);

    fetch(`/publishers`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Publishers not found`);
            }
            return response.json();
        })
        .then(data => {
            if (data.length > 0) {
                // ensure blank publishers aren't added
                const realPublishers = data.filter(publisher => publisher.trim() !== '');

                const content = `<b>Publishers are:</b> ${realPublishers.join(', ')}`;
                searchResults.innerHTML = content;
            } else {
                searchResults.innerHTML = 'Publishers not found';
            }
        })
        .catch(error => {
            console.error(`Error: ${error}`);
            searchResults.innerHTML = `Error: ${error.message}`;
        });
}

function createList() {
    const listName = document.getElementById('listName').value;
    console.log('Creating list: ', listName);
    
    // check if 10 lists have been created
    if (Object.keys(lists).length >= 10) {
        alert('Maximum lists created. Please verify your account if you wish to create more');
        return;
    }
    
    if (!listName) {
        return;
    }
    if (!lists[listName]) {
        lists[listName] = [];
        updateListOptions();
        updateList(lists[listName]);
    } else {
        alert(`${listName} already exists`);
    }
}

function deleteList() {
    const listName = document.getElementById('listName').value;
    if (lists[listName]) {
        delete lists[listName];
        updateListOptions();
        updateList([]);
        const selectList = document.getElementById('selectList');
        const options = selectList.options;
        for (let i = 0; i < options.length; i++) {
            if (options[i].value === listName) {
                selectList.remove(i);
                break;
            }
        }
    } else {
        alert(`${listName} does not exist`);
    }
}

function updateList(heroes) {
    const listsContainer = document.getElementById('lists');
    listsContainer.innerHTML = '';

    if (Array.isArray(heroes)) {
        heroes.forEach(hero => {
            const listItem = document.createElement('li');
            listItem.textContent = `ID: ${hero}`;
            listsContainer.appendChild(listItem);
        });
    } else {
        console.error('Invalid data: ', heroes);
    }
}

// keep dropdown list up to date with lists object
function updateListOptions() {
    const selectList = document.getElementById('selectList');
    selectList.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Select a list';
    selectList.appendChild(defaultOption);

    for (const listName in lists) {
        if (lists.hasOwnProperty(listName)) {
            const option = document.createElement('option');
            option.value = listName;
            option.text = listName;
            selectList.appendChild(option);
        }
    }
}

async function updateListInfo(heroes) {
    addBoxShadow(listResults);

    // const ID = document.getElementById('idForInfo').value;
    // const ID = heroes;
    try {
        // debugging
        console.log('Updating list info with heroes:', heroes);

        if (Array.isArray(heroes)) {
            const listsContainer = document.getElementById('lists');
            listsContainer.innerHTML = '';
            
            const heroesContainer = document.createElement('div');
            heroesContainer.classList.add('heroesContainer');

            for (const result of heroes) {
                if (result.error) {
                    console.error(result.error);
                } else if (result.superhero) {
                    const superhero = result.superhero;
                    const heroBlock = document.createElement('div');
                    addBoxShadow(heroBlock);
                    heroBlock.classList.add('hero-block');

                    for (const property in superhero) {
                        // exclude id
                        if (property !== 'id') {
                            // capitalizing all first letters
                            const propertyName = property.charAt(0).toUpperCase() + property.slice(1);
                            const propertyDiv = document.createElement('div');
                            propertyDiv.innerHTML = `<b>${propertyName}:</b> ${superhero[property]}`;
                            heroBlock.appendChild(propertyDiv);
                        }
                    }
                    // get powers for current hero
                    const powers = await getHerosPowers(superhero.id);
                    if (powers.length > 0) {
                        const powersDiv = document.createElement('div');
                        powersDiv.innerHTML = `<b>Powers:</b> ${powers.join(', ')}`;
                        heroBlock.appendChild(powersDiv);
                    }
                    heroesContainer.appendChild(heroBlock);
                } else {
                    console.error('Superhero is undefined in result');
                }
            }
            listsContainer.appendChild(heroesContainer);
        } else {
            console.error('Invalid data: ', heroes);
        }
    } catch (error) {
        console.error(`Error ${error}`);
        listResults.innerHTML = `Error: ${error.message}`;
    }
}

function displayIDs() {
    const listName = document.getElementById('selectList').value;
    const listsContainer = document.getElementById('lists');

    listsContainer.innerHTML = '';
    // check if an item has been selected and whether it exists
    if (listName && lists[listName]) {
       updateList(lists[listName]);
    } else {
        listsContainer.innerHTML = 'Invalid list';
    }
}

function displayList() {
    const listName = document.getElementById('selectList').value;
    const listsContainer = document.getElementById('lists');

    listsContainer.innerHTML = '';
    
    // check if an item has been selected and whether it exists
    if (listName && lists[listName]) {
        idsToNames(lists[listName])
            .then(result => updateListInfo(result))
            .catch(error => console.error(`Error ${error}`));
    } else {
        listsContainer.innerHTML = 'Invalid list';
    }
}

function addToList() {
    const ID = document.getElementById('idForList').value;

    fetch(`/superheroes/${ID}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`ID ${ID} not found`);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                alert(`Error: ${data.error}`);
            } else {
                // get selected list from dropdown
                const selectedList = document.getElementById('selectList');
                const listName = selectedList.value;

                if (listName) {
                    // check if ID is in the list already
                    if (lists[listName].indexOf(ID) === -1) {
                        // Add ID to the selected list
                        lists[listName].push(ID);
                        updateList(lists[listName]);
                    } else {
                        alert(`ID ${ID} already in list`);
                    }
                } else {
                    alert(`No list selected`);
                }
            }
        })
        .catch(error => {
            alert(`Error: ${error.message}`);
        });
}
