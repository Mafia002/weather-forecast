export const setPlaceholderText = () => {
  const input = document.getElementById("text");
  window.innerWidth < 400
    ? (input.placeholder = "City, State, Country")
    : (input.placeholder = "City, State, Country, or Zip Code");
};

export const hidee = () => {
  const input = document.getElementById("button");
  if (!input.click || !input.event) {
    const x = document.getElementById("currentlocation");
    x.classList.add("none");
  } else {
    x.classList.remove("none");
  }
};

export const addSpinner = (element) => {
  animateButton(element);
  setTimeout(animateButton, 1000, element);
};

const animateButton = (element) => {
  element.classList.toggle("none");
  element.nextElementSibling.classList.toggle("block");
  element.nextElementSibling.classList.toggle("none");
};

export const displayError = (headerMsg, srMsg) => {
  updateWeatherLocationHeader(headerMsg);
  updateScreenReaderConfirmation(srMsg);
};

export const displayApiError = (statusCode) => {
  const properMsg = toProperCase(statusCode.message);
  updateWeatherLocationHeader(properMsg);
  updateScreenReaderConfirmation(`${properMsg}. please try again`);
};

const toProperCase = (text) => {
  const words = text.split(" ");
  const properWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return properWords.join(" ");
};

const updateWeatherLocationHeader = (message) => {
  const h1 = document.getElementById("currentlocation");
  h1.textContent = message;
};

export const updateScreenReaderConfirmation = (message) => {
  document.getElementById("confirmation").textContent = message;
};

export const updateDisplay = (weatherjson, locationObj) => {
  fadeDisplay();
  clearDisplay();
  const weatherClass = getWeatherClass(weatherjson.current.weather[0].icon);
  setBGImage(weatherClass);
  const screenReaderWeather = buildScreenReaderWeather(
    weatherjson,
    locationObj
  );
  updateScreenReaderConfirmation(screenReaderWeather);
  updateWeatherLocationHeader(locationObj.getName());
  //current condtions
  const ccArray = createCurrentConditionsDivs(
    weatherjson,
    locationObj.getUnit()
  );
  displayCurrentConditions(ccArray);
  //six day forecast
  displaySixDayForecast(weatherjson);

  setFocusOnSearch();
  fadeDisplay();
};

const fadeDisplay = () => {
  const cc = document.getElementById("currentforecast");
  cc.classList.toggle(".Zero-vis");
  cc.classList.toggle("fade-in");
  const sixDay = document.getElementById("dailyforecast");
  sixDay.classList.toggle("Zero-vis");
  sixDay.classList.toggle("fade-in");
};

const clearDisplay = () => {
  const currentConditions = document.getElementById("current-condition");
  deleteContents(currentConditions);
  const sixDayForecast = document.getElementById("dailyforecast-content");
  deleteContents(sixDayForecast);
};

const deleteContents = (parentElement) => {
  let child = parentElement.lastElementChild;
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
};

const getWeatherClass = (icon) => {
  const firstTwoChars = icon.slice(0, 2);
  const lastChar = icon.slice(2);
  const weatherLookup = {
    "09": "snow",
    10: "rain",
    11: "rain",
    13: "snow",
    50: "fog",
  };

  let weatherClass;
  if (weatherLookup[firstTwoChars]) {
    weatherClass = weatherLookup[firstTwoChars];
  } else if (lastChar === "d") {
    weatherClass = "clouds";
  } else {
    weatherClass = "night";
  }
  return weatherClass;
};

const setBGImage = (weatherClass) => {
  document.documentElement.classList.add(weatherClass);
  document.documentElement.classList.forEach((img) => {
    if (img !== weatherClass) document.documentElement.classList.remove(img);
  });
};

const buildScreenReaderWeather = (weatherJson, locationObj) => {
  const location = locationObj.getName();
  const unit = locationObj.getUnit();
  const tempUnit = unit === "metric" ? "fahrenheit" : "metric";
  return `${weatherJson.current.weather[0].description} and ${Math.round(
    Number(weatherJson.current.temp)
  )} degree ${tempUnit} in ${location}`;
};

const setFocusOnSearch = () => {
  document.getElementById("text").focus();
};

const createCurrentConditionsDivs = (weatherObj, unit) => {
  const tempUnit = unit === "metric" ? "C" : "F";
  const windUnit = unit === "imperial" ? "mph" : "m/s";
  const icon = createMainImgDiv(
    weatherObj.current.weather[0].icon,
    weatherObj.current.weather[0].description
  );
  const timeZone = createElem("h2", "timeZone", `${weatherObj.timezone}`);

  const temp = createElem(
    "div",
    "temp",
    `${Math.round(Number(weatherObj.current.temp))}° `,
    tempUnit
  );
  const properDesc = toProperCase(weatherObj.current.weather[0].description);
  const desc = createElem("div", "desc", properDesc);
  const feels = createElem(
    "div",
    "feels",
    `Feels ${Math.round(Number(weatherObj.current.feels_like))}°`
  );
  const maxTemp = createElem(
    "div",
    "maxTemp",
    `High ${Math.round(Number(weatherObj.daily[0].temp.max))}°`
  );
  const minTemp = createElem(
    "div",
    "minTemp",
    `Low ${Math.round(Number(weatherObj.daily[0].temp.min))}°`
  );
  const humidity = createElem(
    "div",
    "humidity hum",
    `Humidity ${weatherObj.current.humidity}%`
  );
  const wind = createElem(
    "div",
    "wind",
    `Wind ${Math.round(Number(weatherObj.current.wind_speed))} ${windUnit}`
  );

  return [timeZone, icon, temp, desc, feels, maxTemp, minTemp, humidity, wind];
};

const createMainImgDiv = (icon, altText) => {
  const iconDiv = createElem("div", "icon");
  iconDiv.id = "icon";
  const faIcon = translateIconToFontAwesome(icon);
  faIcon.ariaHidden = true;
  faIcon.title = altText;
  iconDiv.appendChild(faIcon);
  return iconDiv;
};

const createElem = (elemType, divClassName, divText, unit) => {
  const div = document.createElement(elemType);
  div.className = divClassName;
  if (divText) {
    div.textContent = divText;
  }
  if (divClassName === "temp") {
    const unitDiv = document.createElement("div");
    unitDiv.classList.add("unit");
    unitDiv.textContent = unit;
    div.appendChild(unitDiv);
  }
  return div;
};

const translateIconToFontAwesome = (icon) => {
  const i = document.createElement("i");
  const firstTwoChars = icon.slice(0, 2);
  const lastChar = icon.slice(2);
  switch (firstTwoChars) {
    case "01":
      if (lastChar === "d") {
        i.classList.add("wi", "wi-day-sunny");
      } else {
        i.classList.add("wi", "wi-night-clear");
      }
      break;
    case "02":
      if (lastChar === "d") {
        i.classList.add("wi", "wi-day-cloudy");
      } else {
        i.classList.add("wi", "wi-night-alt-cloudy");
      }
      break;
    case "03":
      i.classList.add("wi", "wi-cloud");
      break;
    case "04":
      i.classList.add("wi", "wi-cloudy");
      break;
    case "09":
      i.classList.add("wi", "wi-day-rain wi-flip-horizontal");
      break;
    case "10":
      if (lastChar === "d") {
        i.classList.add("wi", "wi-day-rain");
      } else {
        i.classList.add("wi", "wi-night-rain");
      }
      break;
    case "11":
      i.classList.add("fas", "fa-poo-storm");
      break;
    case "13":
      i.classList.add("far", "fa-snowflake");
      break;
    case "50":
      i.classList.add("fas", "fa-smog");
      break;
    default:
      i.classList.add("far", "fa-question-circle");
  }
  return i;
};

const displayCurrentConditions = (currentConditionsArray) => {
  const ccContainer = document.getElementById("current-condition");
  currentConditionsArray.forEach((cc) => {
    ccContainer.appendChild(cc);
  });
};

const displaySixDayForecast = (weatherjson) => {
    for (let i =1; i <= 6; i++) {
        const dfArray = creatDailyForecastDivs(weatherjson.daily[i]);
        displayDailyForecast(dfArray);
    }
};

const creatDailyForecastDivs = (dayWeather) => {
    const dayAbbreviationText = getDayAbbreviation(dayWeather.dt);
    const dayAbbreviation = createElem("p", "dayAbbreviation", dayAbbreviationText);
    const dayIcon = creatDailyForecastIcon(dayWeather.weather[0].icon, dayWeather.weather[0].description);
    const dayHigh = createElem("p", "dayHigh", `${Math.round(dayWeather.temp.max)}°`);
    const dayLow = createElem("p", "dayLow", `${Math.round(dayWeather.temp.min)}°`);
    return [ dayAbbreviation, dayHigh, dayLow,dayIcon];
};

const getDayAbbreviation = (data) => {
    const dateObj = new Date(data * 1000);
    const utcString = dateObj.toUTCString();
    return utcString.slice(0,3).toUpperCase();
};

const creatDailyForecastIcon = (icon, altText) => {
    const img = document.createElement("img");
    if (window.innerWidth < 768 || window.innerHeight < 1025) {
        img.src = `https://openweathermap.org/img/wn/${icon}.png` ;
    } else {
        img.src = `https://openweathermap.org/img/wn/${icon}@2x.png` ;
    }
    img.alt = altText ;
    return img;
};

const displayDailyForecast = (dfArray) => {
    const dayDiv = createElem("div", "forecastDay");
    dfArray.forEach(el => {
        dayDiv.appendChild(el);
    });
    const dailyforecastContainer = document.getElementById("dailyforecast-content");
    dailyforecastContainer.appendChild(dayDiv);
}

// export const shobar = () => {
//     const botn = document.getElementById("button");
//     const serch = document.getElementById("form");
//     console.log(botn,serch);
//     botn.addEventListener("click", () => {
//         serch.style.opacity = "1";
//     })
// }