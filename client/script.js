const superheroInfo = document.getElementById('superheroInfo');
const superheroPowers = document.getElementById('superheroPowers')

function addBoxShadow(data) {
    data.classList.add('box-shadow-effect');
}

function getHeroInfo() {
    addBoxShadow(superheroInfo);

    const ID = document.getElementById('heroId').value;

    fetch(`/superheroes/${ID}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`: ID ${ID} not found`);
            }
            return response.json();
        })
        .then(data => {
            const superheroInfo = document.getElementById('superheroInfo');
            const content = `<b>ID:</b> ${data.id}<br><b>Name:</b> ${data.name}<br><b>Gender:</b> ${data.Gender}
            <br><b>Eye colour:</b> ${data['Eye color']}<br><b>Race:</b> ${data.Race}<br><b>Hair colour:</b> ${data['Hair color']}
            <br><b>Height:</b> ${data.Height}<br><b>Publisher:</b> ${data.Publisher}<br><b>Skin colour:</b> ${data['Skin color']}
            <br><b>Alignment:</b> ${data.Alignment}<br><b>Weight:</b> ${data.Weight}`;
            superheroInfo.innerHTML = content;
        })
        .catch(error => {
            console.error(`Error ${error}`);
            const superheroInfo = document.getElementById('superheroInfo');
            superheroInfo.innerHTML = `Error ${error.message}`;
        });
}

function getHeroPowers() {
    addBoxShadow(superheroPowers);

    const name = document.getElementById('heroId2').value;

    fetch(`/powers/${name}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`ID ${name} not found`);
            }
            return response.json();
        })
        .then(data => {
            const superheroPowers = document.getElementById('superheroPowers');
            // const powers = data.powers;
            
            if (data.length > 0) {
                const content = `<b>Powers for ${name}:</b> ${data.join(', ')}`;
                superheroPowers.innerHTML = content;
            }
            else {
                superheroPowers.innerHTML = 'No powers found';
            }
        })
        .catch(error => {
            console.error(`Error: ${error}`);
            const superheroInfo = document.getElementById('superheroPowers');
            superheroInfo.innerHTML = `Error: ${error.message}`;
        });
}
