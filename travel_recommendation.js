const bookNowButton = document.getElementById("bookNow");
const btnSearch = document.getElementById('btnSearch');
const searchResults = document.getElementById('searchResults');
const websiteIntro = document.getElementById('website-intro');
const resultDiv = document.getElementById('result');
const destinations = [];


let cachedData = null;

async function loadData() {
    if (!cachedData) {
        try {
            const response = await fetch('travel_recommendation_api.json');
          
            cachedData = await response.json();
            console.log('Data fetched successfully:', cachedData);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }
    return cachedData;
}

function createCard(item) {
    return `
        <div class="card" style="width: 18rem;">
            <img src="${item.imageUrl}" class="card-img-top" alt="${item.name}">
            <div class="card-body">
                <h5 class="card-title">${item.name}</h5>
                <p class="card-text">${item.description}</p>
            </div>
        </div>
    `;
}

// Main search
async function searchDestinations() {
    const inputElement = document.getElementById('conditionInput');
    const data = await loadData();
    if (!inputElement) {
        console.error('Input element with id "conditionInput" not found.');
        return;
    }

    const input = inputElement.value;
    const query = input.trim().toLowerCase();
   
    if (!query) {
        console.log('Empty search query. Showing intro.');
        resultDiv.innerHTML = '';
        if (websiteIntro) websiteIntro.style.display = 'block';
        return;
    }

    
    if (!data) {
        toggleSearchResults(true);
        resultDiv.innerHTML = 'An error occurred while fetching data.';
        return;
    }

    let results = [];

    for (const category in data) {
        const items = data[category];
        console.log(`Checking category: ${category} with ${items.length} items`);
        // 1. Match category name
        if (category.toLowerCase().includes(query)) {
            items.forEach(item => {
                if (item.cities) {
                    results.push(...item.cities);
                } else {
                    results.push(item);
                }
            });
            continue; 
        }

 
        items.forEach(item => {
        
            if (item.name.toLowerCase().includes(query)) {
                if (item.cities) {
                    results.push(...item.cities);
                } else {
                    results.push(item);
                }
            }

            
            if (item.cities) {
                item.cities.forEach(city => {
                    if (city.name.toLowerCase().includes(query)) {
                        results.push(city);
                    }
                });
            }
        });
    }
    const uniqueResults = Array.from(
        new Map(results.map(r => [r.name, r])).values()
    );

    if (uniqueResults.length > 0) {
        resultDiv.innerHTML = uniqueResults.map(createCard).join('');
        if (websiteIntro) websiteIntro.style.display = 'none';
            toggleSearchResults(true);
    } else {
        resultDiv.innerHTML = 'No results found.';
    }
}

function toggleSearchResults(show) {
    searchResults.style.display = show ? 'block' : 'none';
}

btnSearch.addEventListener('click', searchDestinations);