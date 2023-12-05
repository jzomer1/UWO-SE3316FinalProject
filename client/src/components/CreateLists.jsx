import React, { useState } from 'react'

export default function CreateLists() {
  const [lists, setLists] = useState({});
//   const [selectedList, setSelectedList] = useState('');
//   const [listResults, setListResults] = useState([]);

  // styling for search results
  const addBoxShadow = (data) => {
    data.classList.add('box-shadow-effect');
  }

  const createList = () => {
    const listName = document.getElementById('listName').value;
    console.log('Creating list: ', listName);
    
    // check if 10 lists have been created
    if (Object.keys(lists).length >= 20) {
        alert('Maximum lists created');
        return;
    }
    
    if (!listName) {
        alert("Please enter a list name")
        return;
    }
    if (!lists[listName]) {
        lists[listName] = [];
        updateListOptions();
        updateList(lists[listName]);
    } else {
        alert(`${listName} already exists`);
    }
    setLists((prevLists) => ({ ...prevLists, [listName]: [] }));
    updateListOptions();
    updateList([]);
  }

  const updateList = (heroes) => {
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

  const updateListOptions = () => {
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

  const updateListInfo = async (heroes) => {
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
    }
  }

  const displayIDs = () => {
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

  const displayList = async () => {
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

  const addToList = async () => {
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

  const fetchHeroPowers = async (ID) => {
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

  const getHerosPowers = async (ID) => {
    try {
        const data = await fetchHeroPowers(ID);
        return data;
    } catch (error) {
        console.error(`Error fetching powers: ${error}`);
        return [];
    }
  }

  const idToName = async (ID) => {
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

  const idsToNames = async (IDs) => {
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

  const deleteList = async () => {
    const selectList = document.getElementById('selectList');
    const listName = selectList.value;

    if (lists[listName]) {
        const confirmation = window.confirm(`Are you sure you want to delete '${listName}'`);
        if (confirmation) {
            delete lists[listName];
            updateListOptions();
            updateList([]);
            const options = selectList.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].value === listName) {
                    selectList.remove(i);
                    break;
                }
            }
        }
    } else {
        alert(`Please select a list to delete`);
    }
  }

  return (
    <div>
        <input type="text" id="listName" placeholder="List Name"/>
        <button className="createList" onClick={createList}>Create</button>
        <button className="deleteList" onClick={deleteList}>Delete</button>
        <select id="selectList">
            <option value="">Select a list</option>
        </select>
        <button className="viewIDs" onClick={displayIDs}>View IDs</button>
        <button className="viewList" onClick={displayList}>View List</button>
        <input type="number" id="idForList" placeholder="Superhero ID (0 - 733)"/>
        <button className="searchForList" onClick={addToList}>Add to list</button>
        
        <div id="lists">
            <ul id="list"></ul>
        </div>
        <div id="listResults"/>
    </div>
  )
}
