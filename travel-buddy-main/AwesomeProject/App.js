import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, Alert, Dimensions, ImageBackground, Switch } from 'react-native';
import WeatherService from './WeatherService';
import FavoritesManager from './FavoritesManager';
import { LineChart } from 'react-native-chart-kit';

const backgroundImage = require('./assets/backgroundweather.png');
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const App = () => {
  const [destination, setDestination] = useState('');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [unit, setUnit] = useState('metric');
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const favs = await FavoritesManager.getFavoriteLocations();
    setFavorites(favs);
  };

  const handleGetWeather = async () => {
    try {
      const weatherData = await WeatherService.getWeatherData(destination, unit);
      setCurrentWeather(weatherData);
      const forecastData = await WeatherService.getForecastData(weatherData.id, unit);
      setForecast(forecastData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSaveFavorite = async () => {
    await FavoritesManager.saveFavoriteLocation(destination);
    loadFavorites();
    Alert.alert('Saved', `${destination} has been added to favorites.`);
  };

  const handleRemoveFavorite = async (item) => {
    await FavoritesManager.removeFavoriteLocation(item);
    loadFavorites();
    Alert.alert('Removed', `${item} has been removed from favorites.`);
  };

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    setUnit(prevUnit => (prevUnit === 'metric' ? 'imperial' : 'metric'));
    if (currentWeather) {
      handleGetWeather();
    }
  };

  const renderFavoriteItem = ({ item }) => (
    <View style={styles.favoriteItem}>
      <Text style={styles.favoriteText}>{item}</Text>
      <TouchableOpacity onPress={() => handleRemoveFavorite(item)}>
        <Text style={styles.removeFavorite}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  const renderWeatherInfo = () => (
    <View style={styles.weatherInfo}>
      <Text>Current Weather in {currentWeather.name}: </Text>
      <Text>Temperature: {currentWeather.main.temp}°{unit === 'metric' ? 'C' : 'F'}</Text>
      <Text>Humidity: {currentWeather.main.humidity}%</Text>
      <Text>Wind Speed: {currentWeather.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</Text>
    </View>
  );

  const renderForecastChart = () => {
    if (!forecast || !forecast.list || forecast.list.length === 0) {
      return <Text>No forecast data available.</Text>;
    }

    const labels = forecast.list.slice(0, 5).map((_, index) => `Day ${index + 1}`);
    const data = forecast.list.slice(0, 5).map(item => item.main.temp);

    return (
      <LineChart
        data={{
          labels: labels,
          datasets: [{ data: data }]
        }}
        width={Dimensions.get('window').width - 30}
        height={220}
        yAxisLabel="°C"
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16
          }
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
      />
    );
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <TextInput
          style={styles.input}
          placeholder="Enter a destination"
          placeholderTextColor="#fff"
          onChangeText={setDestination}
          value={destination}
        />
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>{isEnabled ? 'Fahrenheit' : 'Celsius'}</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <TouchableOpacity onPress={handleGetWeather} style={styles.button}>
          <Text style={styles.buttonText}>Get Weather</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSaveFavorite} style={styles.button}>
          <Text style={styles.buttonText}>Save to Favorites</Text>
        </TouchableOpacity>
        
        {currentWeather && renderWeatherInfo()}
        {forecast && renderForecastChart()}
        
        <Text style={styles.title}>Favorite Locations:</Text>
        <FlatList
          data={favorites}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderFavoriteItem}
          style={styles.favoritesList}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    resizeMode: 'cover', // or 'stretch'
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Semi-transparent white to soften the background image
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    width: '90%',
    borderColor: '#ffffff',
    borderWidth: 1,
    padding: 15,
    borderRadius: 25,
    fontSize: 18,
    marginBottom: 10,
    color: '#ffffff',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Dark background for the input field for readability
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 10,
    elevation: 2,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchLabel: {
    color: '#ffffff',
    marginRight: 10,
    fontSize: 16,
  },
  weatherInfo: {
    width: '90%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  favoritesList: {
    width: '100%',
  },
  // ... rest of your styles ...
});

export default App;