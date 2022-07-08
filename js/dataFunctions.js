const App = 'a7876f64b3df9c50fee5506c3994efb3'; 
export const setLocationObject = (locationObj, coordsObj) => {
    const { lat, lon, name, unit} = coordsObj;
    locationObj.setLat(lat);
    locationObj.setLon(lon);
    locationObj.setName(name);
    if(unit) {
        locationObj.setUnit(unit);
    }
};

export const getHomeLocation = () => {
    return localStorage.getItem("defaultWeatherLocation");
};

export const getWeatherFromCoords = async (locationObj) => {
    const lat = locationObj.getLat();
    const lon = locationObj.getLon();
    const units = locationObj.getUnit();
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=${units}&appid=${App}`;
    try {
        const weatherStream  = await fetch(url);
        const weatherJson = await weatherStream.json();
        console.log(weatherJson);
        return weatherJson;
    } catch (error) {
        console.log(error.message);
    }
};    

export const getCoordsFromApi = async (entryText, unit) => {
    const regex = /^\d+$/g;
    const flag = regex.test(entryText) ? "zip" : "q";
    const url = `https://api.openweathermap.org/data/2.5/weather?${flag}=${entryText}&units=${unit}&appid=${App}`;
    const encodedUrl = encodeURI(url);
    try {
        const dataStream = await fetch(encodedUrl);
        const jsonData = await dataStream.json();
        return jsonData;
    } catch (err) {
        console.error(err.stack);
    }
};

export const cleanText = (text) => {
    const regex = / {2,}/g;
    const entryText = text.replaceAll(regex,  " ").trim();
    return entryText;
};    