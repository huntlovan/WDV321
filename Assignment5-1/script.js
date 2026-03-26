// script.js - Use async / await or promise chaining
// Handle unsuccessful API requests (error handling)
// Display a user-friendly error message, do not let errors fail silently
const countryInput = document.getElementById("countryInput");
const searchBtn = document.getElementById("searchBtn");
const statusMessage = document.getElementById("statusMessage");
const resultsContainer = document.getElementById("results");
const resultsPanel = document.querySelector(".results-panel");

function setStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.classList.toggle("error", isError);
}

function clearResults() {
  resultsContainer.innerHTML = "";
}

function renderCountries(countries) {
  const cardsHtml = countries
    .map((country) => {
      const officialName = country?.name?.official || "Not available";
      const region = country?.region || "Not available";
      const subregion = country?.subregion || "Not available";

      return `
        <article class="country-card">
          <h2>${officialName}</h2>
          <p><strong>Region:</strong> ${region}</p>
          <p><strong>Sub-Region:</strong> ${subregion}</p>
        </article>
      `;
    })
    .join("");

  resultsContainer.innerHTML = cardsHtml;
}

// async function to fetch country data from the hardcoded API url, handle errors, and return the data.
// Uses the Rest Countries API: https://restcountries.com/v3.1/name/{name} 
async function fetchCountryData(countryName) {
  const endpoint = `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=false`;

  const response = await fetch(endpoint);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("No matching country was found. Try a different name.");
    }

    throw new Error("The country service is unavailable right now. Please try again in a moment.");
  }

  return response.json();
}

async function handleSearch() {
  const query = countryInput.value.trim();

  if (!query) {
    clearResults();
    setStatus("Enter a country name to start your search.", true);
    return;
  }

  clearResults();
  setStatus("Loading country data...");
  resultsPanel.setAttribute("aria-busy", "true");

  try {
    const countries = await fetchCountryData(query);

    if (!Array.isArray(countries) || countries.length === 0) {
      setStatus("No country data was returned.", true);
      return;
    }

    renderCountries(countries);
    setStatus(`Found ${countries.length} result(s).`);
  } catch (error) {
    setStatus(error.message || "Something went wrong while fetching data.", true);
  } finally {
    resultsPanel.setAttribute("aria-busy", "false");
  }
}

searchBtn.addEventListener("click", handleSearch);
countryInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleSearch();
  }
});

setStatus("Search for a country to view details.");
