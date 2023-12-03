import React, { useState } from 'react'

export default function SearchHeroes() {
    const [error, setError] = useState(null);
    const [results, setResults] = useState(null);
    const [expandedResults, setExpandedResults] = useState([]);
    
    const searchHeroes = async (e) => {
        e.preventDefault();
        
        const field = document.getElementById('field').value;
        const pattern = document.getElementById('pattern').value;
        const n = parseInt(document.getElementById('n').value);

        try {
            const response = await fetch(`/match?field=${field}&pattern=${pattern}&n=${n}`);
            console.log(response);

            if (response.ok) {
                const data = await response.json();
                console.log(data);

                if (Array.isArray(data)) {
                    setResults(data);
                    setError(null);
                    setExpandedResults([]);
                } else {
                    setResults([]);
                    setError('Invalid data format');
                }
              } else {
                    setResults([]);
                    setError('Invalid response status: ' + response.status);
              }
            } catch (error) {
                console.error(`Error searching heroes: ${error}`);
                setResults([]);
                setError('Error: ' + error.message);
            }
    };
    const expand = () => {
        let expandedResultsArray = [];
    
        if (Array.isArray(results)) {
            expandedResultsArray = results.map((superhero) => {
                const attributes = [];
                // variable to store hero name
                let heroName;
        
                for (const property in superhero) {
                    if (superhero.hasOwnProperty(property)) {
                        // capitalize first letters, force 'id' to 'ID'
                        const propertyName = (property === 'id') ? 'ID' : property.charAt(0).toUpperCase() + property.slice(1);
                        attributes.push(
                            <div key={property}><b>{propertyName}:</b> {superhero[property]}</div>
                        );
                        // save hero name to add to DDG button at the end
                        if (propertyName === 'Name') {
                            heroName = superhero[property];
                        }
                    }
                }
                // add hero name & publisher to DDG button
                if (heroName) {
                    const duckButton = (
                        <button key={`duckButton-${superhero.id}`} onClick={() => duckSearch(heroName, superhero.Publisher)}>Search on DDG</button>
                    );
                    attributes.push(duckButton);
                }

                return (
                    <div key={superhero.id} className="hero-block box-shadow-effect">
                        {attributes}
                    </div>
                );
            });

            setExpandedResults(expandedResultsArray);
        } else {
          alert('Please search first');
        }
    };
    const duckSearch = (name, publisher) => {
        const query = `${name} ${publisher}`;
        const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
        // open search results in new tab
        window.open(searchUrl, '_blank');
    };

    return (
    <div>
        <p>Select Field: </p>
        <select id="field">
            <option value="name">Name</option>
            <option value="Race">Race</option>
            <option value="Publisher">Publisher</option>
            <option value="power">Power</option>
        </select>
        <input
        type="text"
        id="pattern"
        placeholder="Enter pattern"
        />
        <input
        type="number"
        id="n"
        placeholder="Enter number of results"
        />
        <button onClick={searchHeroes}>Search</button>
        <button onClick={expand}>Expand Results</button>
        <div id="mainSearchResults">
            {expandedResults.length === 0 ? (
            // initial results
            results?.map((superhero) => (
                <div key={superhero.id} className="hero-block box-shadow-effect">
                    <div><b>Name:</b> {superhero.name}</div>
                    <div><b>Publisher:</b> {superhero.Publisher}</div>
                    <button onClick={() => duckSearch(superhero.name, superhero.Publisher)}>Search on DDG</button>
                </div>
            ))
            ) : (
            // expanded results
            expandedResults
            )}
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
    );
}
