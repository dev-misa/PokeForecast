const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "8046ce13b89f63271b318101b17ac333";

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = cityInput.value;
  if (city) {
    try {
      const weatherData = await getWeatherData(city);
      displayWeatherInfo(weatherData);
    } catch (error) {
      console.error(error);
      displayError(error.message);
    }
  } else {
    displayError("Please enter a city.");
  }
});

async function getWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error("Weather data not available:(");
  }

  const data = await response.json();
  const timezoneResponse = await fetch(
    `https://api.timezonedb.com/v2.1/get-time-zone?key=KZN9KCM3G3GT&format=json&by=position&lat=${data.coord.lat}&lng=${data.coord.lon}`
  );
  const timezoneData = await timezoneResponse.json();
  data.timezone = timezoneData.zoneName;
  return data;
}

function displayWeatherInfo(data) {
  const {
    name: city,
    main: { temp, humidity },
    weather: [{ description, id }],
  } = data;
  card.textContent = "";
  card.style.display = "flex";

  const cityDisplay = document.createElement("h1");
  const tempDisplay = document.createElement("p");
  const humidityDisplay = document.createElement("p");
  const descDisplay = document.createElement("p");
  const weatherEmoji = document.createElement("div");

  cityDisplay.textContent = city;
  tempDisplay.textContent = `${((temp - 273.15) * (9 / 5) + 32).toFixed(1)}°F`;
  humidityDisplay.textContent = `Humidity: ${humidity}%`;
  descDisplay.textContent = description;
  weatherEmoji.style.backgroundImage = `url('${getWeatherEmoji(id)}')`;
  weatherEmoji.classList.add("weatherEmoji");
  cityDisplay.classList.add("cityDisplay");
  tempDisplay.classList.add("tempDisplay");
  humidityDisplay.classList.add("humidityDisplay");
  descDisplay.classList.add("descDisplay");

  card.appendChild(cityDisplay);
  card.appendChild(tempDisplay);
  card.appendChild(humidityDisplay);
  card.appendChild(descDisplay);
  card.appendChild(weatherEmoji);
  const cityTimeZone = data.timezone;
  const currentTime = moment.tz(cityTimeZone);
  const currentHour = currentTime.hour();
  const isDaytime = currentHour >= 6 && currentHour < 18;
  card.style.backgroundImage = isDaytime ? "url('public/dayCard.jpg')" : "url('public/nightCard.jpg')";
  card.style.color = isDaytime ? "black" : "white";
  cityDisplay.style.color = isDaytime ? "black" : "white";
}

function getWeatherEmoji(weatherId) {
  switch (true) {
    case weatherId >= 200 && weatherId < 300:
      return "public/thunderstorm.png"; // thunderstorm image
    case weatherId >= 300 && weatherId < 400:
      return "public/drizzle.png"; // drizzle image
    case weatherId >= 500 && weatherId < 600:
      return "public/rainy.png"; // rain image
    case weatherId >= 600 && weatherId < 700:
      return "public/snowy.png"; // snow image
    case weatherId >= 700 && weatherId < 800:
      return "public/atmosphere.png"; // atmosphere image
    case weatherId === 800:
      return "public/sunny.png"; // clear weather image
    case weatherId >= 801 && weatherId < 810:
      return "public/cloudy.png"; // clouds image
    default:
      return "public/unknown.png"; // unknown weather image
  }
}

function displayError(message) {
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorDisplay");

  card.textContent = "";
  card.style.display = "flex";
  card.appendChild(errorDisplay);
}
