// get the wrapper elements for the different screens
const app = document.getElementById("app");

const planetOverview = document.getElementById("planet-overview");
const singlePlanet = document.getElementById("planet-info");
const errorScreen = document.getElementById("error");

// planets array with all the planets in the solar system
let planets = [];

// base url for the api
const baseUrl = "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com";
// gets keys from the server
async function getKeys() {
  try {
    const response = await fetch(baseUrl + "/keys", { method: "POST" });
    const data = await response.json();

    const key = data.key;
    getPlanetInfo(key);
  } catch (error) {
    console.log(error);
    showError();
  }
}
getKeys();

// gets planet info from the server once we have a valid key
async function getPlanetInfo(key) {
  try {
    const response = await fetch(baseUrl + "/bodies", {
      headers: {
        "x-zocom": key,
      },
      method: "GET",
    });
    const data = await response.json();

    planets = data.bodies;

    setupPlanetTracking();
  } catch (error) {
    showError();
  }
}

// setup planet tracking so each element gets a click event
function setupPlanetTracking() {
  const stellarObjects = document.getElementsByClassName("stellar-body");

  for (let i = 0; i < planets.length; i++) {
    stellarObjects[i].addEventListener("click", () => {
      showPlanetInfo(planets[i]);
    });
  }
}

// get the search input and add event listener to filter planets, dimming ones not matching search text
const searchInput = document.getElementById("search");
searchInput.addEventListener("input", (event) => {
  const searchValue = event.target.value.toLowerCase();

  const stellarObjects = document.getElementsByClassName("stellar-body");

  for (let i = 0; i < planets.length; i++) {
    if (planets[i].name.toLowerCase().includes(searchValue)) {
      stellarObjects[i].style.opacity = 1;
    } else {
      stellarObjects[i].style.opacity = 0.4;
    }
  }
});

// get the back button on planet overview and add click event to return to main page
const backButton = document.getElementById("back-button");
backButton.addEventListener("click", () => {
  planetOverview.style.display = "flex";
  singlePlanet.style.display = "none";
  errorScreen.style.display = "none";
});

// show planet info for clicked planet
function showPlanetInfo(planetInfo) {
  // show page for single planet and hide the other ones
  planetOverview.style.display = "none";
  singlePlanet.style.display = "flex";
  errorScreen.style.display = "none";

  // get variables for the planet side view
  const planetSideView = document.getElementById("planet-side-view");

  // remove all classes in case of previous planet
  planetSideView.classList = "";

  // add classes for the planet
  planetSideView.classList.add("stellar-body");
  planetSideView.classList.add(planetInfo.latinName.toLowerCase());
  planetSideView.classList.add("big-body");

  //get text fields needed and add planet info to them
  const planetInfoText = document.getElementById("planet-info-text");
  const planetMainTitle = document.getElementById("planet-main-title");
  const planetSecondaryTitle = document.getElementById(
    "planet-secondary-title"
  );
  const planetInfoDiameter = document.getElementById("planet-info-diameter");
  const planetInfoDistance = document.getElementById("planet-info-distance");
  const planetInfoMaxTemp = document.getElementById("planet-info-max-temp");
  const planetInfoMinTemp = document.getElementById("planet-info-min-temp");
  const planetInfoMoons = document.getElementById("planet-info-moons");
  planetMainTitle.textContent = planetInfo.name.toUpperCase();
  planetSecondaryTitle.textContent = planetInfo.latinName.toUpperCase();
  planetInfoText.textContent = planetInfo.desc;
  planetInfoDiameter.textContent = `${planetInfo.circumference} km`;
  planetInfoDistance.textContent = `${planetInfo.distance} km`;
  planetInfoMaxTemp.textContent = `${planetInfo.temp.day} °C`;
  planetInfoMinTemp.textContent = `${planetInfo.temp.night} °C`;

  planetInfoMoons.textContent = "";
  for (const moon of planetInfo.moons) {
    planetInfoMoons.textContent += moon + ", ";
  }
}

// shows error screen
function showError() {
  planetOverview.style.display = "none";
  singlePlanet.style.display = "none";
  errorScreen.style.display = "flex";
}
