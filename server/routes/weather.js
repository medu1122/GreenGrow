const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');

// Get weather by coordinates
router.get('/coordinates', auth, async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const weatherApiKey = process.env.OPENWEATHER_API_KEY;
    if (!weatherApiKey) {
      return res.status(500).json({ error: 'Weather API key not configured' });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric&lang=vi`
    );

    const weather = response.data;
    const weatherData = {
      temperature: weather.main.temp,
      feelsLike: weather.main.feels_like,
      humidity: weather.main.humidity,
      pressure: weather.main.pressure,
      description: weather.weather[0].description,
      icon: weather.weather[0].icon,
      windSpeed: weather.wind.speed,
      windDirection: weather.wind.deg,
      location: weather.name,
      country: weather.sys.country,
      sunrise: new Date(weather.sys.sunrise * 1000),
      sunset: new Date(weather.sys.sunset * 1000),
      timestamp: new Date(weather.dt * 1000)
    };

    res.json(weatherData);

  } catch (error) {
    console.error('Weather API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Get weather by city name
router.get('/city', auth, async (req, res) => {
  try {
    const { city } = req.query;
    
    if (!city) {
      return res.status(400).json({ error: 'City name is required' });
    }

    const weatherApiKey = process.env.OPENWEATHER_API_KEY;
    if (!weatherApiKey) {
      return res.status(500).json({ error: 'Weather API key not configured' });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${weatherApiKey}&units=metric&lang=vi`
    );

    const weather = response.data;
    const weatherData = {
      temperature: weather.main.temp,
      feelsLike: weather.main.feels_like,
      humidity: weather.main.humidity,
      pressure: weather.main.pressure,
      description: weather.weather[0].description,
      icon: weather.weather[0].icon,
      windSpeed: weather.wind.speed,
      windDirection: weather.wind.deg,
      location: weather.name,
      country: weather.sys.country,
      coordinates: {
        lat: weather.coord.lat,
        lon: weather.coord.lon
      },
      sunrise: new Date(weather.sys.sunrise * 1000),
      sunset: new Date(weather.sys.sunset * 1000),
      timestamp: new Date(weather.dt * 1000)
    };

    res.json(weatherData);

  } catch (error) {
    console.error('Weather API error:', error.response?.data || error.message);
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'City not found' });
    }
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Get weather forecast
router.get('/forecast', auth, async (req, res) => {
  try {
    const { lat, lon, city } = req.query;
    
    if (!lat && !lon && !city) {
      return res.status(400).json({ error: 'Coordinates or city name is required' });
    }

    const weatherApiKey = process.env.OPENWEATHER_API_KEY;
    if (!weatherApiKey) {
      return res.status(500).json({ error: 'Weather API key not configured' });
    }

    let url;
    if (city) {
      url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${weatherApiKey}&units=metric&lang=vi`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric&lang=vi`;
    }

    const response = await axios.get(url);
    const forecast = response.data;

    // Process forecast data to get daily forecasts
    const dailyForecasts = [];
    const dailyData = {};

    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      
      if (!dailyData[date]) {
        dailyData[date] = {
          date: new Date(item.dt * 1000),
          temps: [],
          descriptions: [],
          icons: [],
          humidity: [],
          windSpeed: []
        };
      }

      dailyData[date].temps.push(item.main.temp);
      dailyData[date].descriptions.push(item.weather[0].description);
      dailyData[date].icons.push(item.weather[0].icon);
      dailyData[date].humidity.push(item.main.humidity);
      dailyData[date].windSpeed.push(item.wind.speed);
    });

    // Calculate averages for each day
    Object.values(dailyData).forEach(day => {
      dailyForecasts.push({
        date: day.date,
        temperature: {
          min: Math.min(...day.temps),
          max: Math.max(...day.temps),
          avg: Math.round(day.temps.reduce((a, b) => a + b, 0) / day.temps.length)
        },
        description: day.descriptions[Math.floor(day.descriptions.length / 2)], // Middle of day
        icon: day.icons[Math.floor(day.icons.length / 2)],
        humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
        windSpeed: Math.round(day.windSpeed.reduce((a, b) => a + b, 0) / day.windSpeed.length * 10) / 10
      });
    });

    res.json({
      location: forecast.city.name,
      country: forecast.city.country,
      coordinates: {
        lat: forecast.city.coord.lat,
        lon: forecast.city.coord.lon
      },
      forecasts: dailyForecasts.slice(0, 5) // 5 days forecast
    });

  } catch (error) {
    console.error('Weather forecast error:', error.response?.data || error.message);
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.status(500).json({ error: 'Failed to fetch weather forecast' });
  }
});

module.exports = router;
