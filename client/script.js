const searchResults = document.getElementById('searchResults');

function addBoxShadow(data) {
    data.classList.add('box-shadow-effect');
}

function getHeroInfo() {
    addBoxShadow(searchResults);

    const ID = document.getElementById('heroId').value;

    fetch(`/superheroes/${ID}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`ID ${ID} not found`);
            }
            return response.json();
        })
        .then(data => {
            const content = `<b>ID:</b> ${data.id}<br><b>Name:</b> ${data.name}<br><b>Gender:</b> ${data.Gender}
            <br><b>Eye colour:</b> ${data['Eye color']}<br><b>Race:</b> ${data.Race}<br><b>Hair colour:</b> ${data['Hair color']}
            <br><b>Height:</b> ${data.Height}<br><b>Publisher:</b> ${data.Publisher}<br><b>Skin colour:</b> ${data['Skin color']}
            <br><b>Alignment:</b> ${data.Alignment}<br><b>Weight:</b> ${data.Weight}`;
            searchResults.innerHTML = content;
        })
        .catch(error => {
            console.error(`Error ${error}`);
            searchResults.innerHTML = `Error: ${error.message}`;
        });
}

function getHeroPowers() {
    addBoxShadow(searchResults);

    const name = document.getElementById('heroId2').value;

    fetch(`/powers/${name}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`ID ${name} not found`);
            }
            return response.json();
        })
        .then(data => {
            if (data.length > 0) {
                const content = `<b>Powers for ${name}:</b> ${data.join(', ')}`;
                searchResults.innerHTML = content;
            }
            else {
                searchResults.innerHTML = 'No powers found';
            }
        })
        .catch(error => {
            console.error(`Error: ${error}`);
            searchResults.innerHTML = `Error: ${error.message}`;
        });
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
            }
            else {
                searchResults.innerHTML = 'Publishers not found';
            }
        })
        .catch(error => {
            console.error(`Error: ${error}`);
            searchResults.innerHTML = `Error: ${error.message}`;
        });
}
