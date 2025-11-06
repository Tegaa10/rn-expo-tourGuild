import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@favorites';

const saveFavoriteLocation = async (location) => {
  try {
    let favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    favorites = favorites ? JSON.parse(favorites) : [];
    if (!favorites.includes(location)) {
      favorites.push(location);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch (e) {
    console.error('Failed to save favorite', e);
  }
};

const getFavoriteLocations = async () => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (e) {
    console.error('Failed to fetch favorites', e);
    return [];
  }
};

const removeFavoriteLocation = async (location) => {
  try {
    let favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    favorites = favorites ? JSON.parse(favorites) : [];

    const newFavorites = favorites.filter(item => item !== location);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  } catch (e) {
    console.error('Failed to remove favorite', e);
  }
};

export default { saveFavoriteLocation, getFavoriteLocations, removeFavoriteLocation };
