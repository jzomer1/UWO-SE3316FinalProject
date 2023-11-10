// div that displays search results
const searchResults = document.getElementById('searchResults');
// global variable to store favourites lists
let lists = {};

// styling for search results
function addBoxShadow(data) {
    data.classList.add('box-shadow-effect');
}

function getHeroInfo() {
    addBoxShadow(searchResults);

    const ID = document.getElementById('idForInfo').value;

    fetch(`/superheroes/${ID}`)
        .then(response => {
            if (!response.ok) {
                // throw new Error(`ID ${ID} not found`);
                return {
                    error: `ID ${ID} not found`
                }
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                searchResults.innerHTML = `Error: ${data.error}`
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

async function getHeroPowers(ID) {
    addBoxShadow(searchResults);

    try {
        const name = await idToName(ID);
        const response = await fetch(`/powers/${name}`);
        if (!response.ok) {
            throw new Error(`Powers not found for ${ID}`);
        }
        const data = await response.json();
        if (data.length > 0) {
            const content = `<b>Powers for ${name}:</b> ${data.join(', ')}`;
            searchResults.innerHTML = content;
        } else {
            searchResults.innerHTML = 'No powers found';
        }
    } catch (error) {
        searchResults.innerHTML = `ID: ${ID} is not valid`
    }
}

async function idToName(ID) {
    try {
        const response = await fetch(`/superheroes/${ID}`);
        if (!response.ok) {
            throw new Error(`ID ${ID} not found`);
        }
        const data = await response.json();
        if (data.error) {
            throw new Error(`ID ${ID} not found`);
        } else {
            const name = `${data.name}`;
            return name;
        }
    } catch {
        return Promise.reject(error);
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
                const content = `<b>Publishers are:</b> ${data.join(', ')}`;
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
    // const selectList = document.getElementById('selectList');
    // selectList.innerHTML = '';
    const listsContainer = document.getElementById('lists');
    listsContainer.innerHTML = '';

    if (Array.isArray(heroes)) {
        heroes.forEach(hero => {
            const listItem = document.createElement('li');
            // listItem.textContent = `ID: ${hero.id} Name: ${hero.name}`
            listItem.textContent = `ID: ${hero}`
            listsContainer.appendChild(listItem);
        });
    } else {
        console.error('Invalid data: ', heroes)
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

    // const listItems = new Set();

    for (const listName in lists) {
        if (lists.hasOwnProperty(listName)) {
            // if (!listItems.has(listName)) {
            const option = document.createElement('option');
            option.value = listName;
            option.text = listName;
            selectList.appendChild(option);
            // add to set to track
            // listItems.add(listName);
            // }
        }
    }
}

function displayList() {
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
                alert(`Error: ${data.error}`)
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
            alert(`Error: ${error.message}`)
        });
}
