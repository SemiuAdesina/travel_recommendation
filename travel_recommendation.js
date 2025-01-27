// Fetch JSON data and display recommendations
fetch('travel_recommendation_api.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        displayRecommendations(data);
    })
    .catch(error => console.error('Error fetching data:', error));

// Function to display recommendations
function displayRecommendations(data) {
    const resultsDiv = document.getElementById('recommendation-results');
    resultsDiv.innerHTML = ''; // Clear previous content if any

    // Display cities from countries
    data.countries.forEach(country => {
        country.cities.forEach(city => {
            const cityCard = `
                <div class="city-card">
                    <img src="${city.imageUrl}" alt="${city.name}">
                    <h3>${city.name}</h3>
                    <p>${city.description}</p>
                    <p id="time-${city.name.replace(/\s+/g, '-').toLowerCase()}">Loading time...</p>
                    <button class="visit-btn">Visit</button>
                </div>
            `;
            resultsDiv.innerHTML += cityCard;

            // Fetch and display time for the city
            fetchCityTime(city.name, country.timeZone);
        });
    });

    // Display temples
    data.temples.forEach(temple => {
        const templeCard = `
            <div class="temple-card">
                <img src="${temple.imageUrl}" alt="${temple.name}">
                <h3>${temple.name}</h3>
                <p>${temple.description}</p>
            </div>
        `;
        resultsDiv.innerHTML += templeCard;
    });

    // Display beaches
    data.beaches.forEach(beach => {
        const beachCard = `
            <div class="beach-card">
                <img src="${beach.imageUrl}" alt="${beach.name}">
                <h3>${beach.name}</h3>
                <p>${beach.description}</p>
            </div>
        `;
        resultsDiv.innerHTML += beachCard;
    });
}

// Function to fetch and display the current time in a city's time zone
function fetchCityTime(cityName, timeZone) {
    const options = {
        timeZone: timeZone,
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };
    const cityTime = new Date().toLocaleTimeString('en-US', options);
    const timeElementId = `time-${cityName.replace(/\s+/g, '-').toLowerCase()}`;
    const timeElement = document.getElementById(timeElementId);
    if (timeElement) {
        timeElement.textContent = `Current time: ${cityTime}`;
    }
}

// Search function
function search() {
    const query = document.getElementById('search-bar').value.toLowerCase(); // Get search input
    const allCards = document.querySelectorAll('.city-card, .temple-card, .beach-card'); // Get all cards

    allCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase(); // Get title
        const description = card.querySelector('p').textContent.toLowerCase(); // Get description
        // Match query against title or description
        card.style.display = title.includes(query) || description.includes(query) ? 'block' : 'none';
    });
}

// Clear search results
function clearSearch() {
    document.getElementById('search-bar').value = ''; // Clear the search bar
    const allCards = document.querySelectorAll('.city-card, .temple-card, .beach-card'); // Get all cards
    allCards.forEach(card => (card.style.display = 'block')); // Show all cards
}
