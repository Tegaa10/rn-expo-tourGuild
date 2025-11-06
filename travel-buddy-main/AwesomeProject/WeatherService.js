import axios from 'axios';

const API_KEY = 'e8bc5789abcc839857f78c65679481c5'; // Your OpenWeatherMap API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const getWeatherData = async (city) => {
  try {
    const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching current weather data:", error);
    throw error;
  }
};

const getForecastData = async (cityId) => {
  try {
    const url = `${BASE_URL}/forecast?id=${cityId}&appid=${API_KEY}&units=metric`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching weather forecast data:", error);
    throw error;
  }
};

export default { getWeatherData, getForecastData };
