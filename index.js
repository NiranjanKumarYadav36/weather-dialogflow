const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const API_KEY = 'f89c5e285d63eff12caeb403f0946c91'; // Replace with your key

app.get('/', (req, res) => {
  res.send('Weather webhook is running!');
});

app.post('/webhook', async (req, res) => {
    const intentName = req.body.queryResult.intent.displayName;
    const parameters = req.body.queryResult.parameters;
    
    if (intentName === 'Get Weather') {
        const city = parameters['geo-city']; // Changed from parameters.city
        
        if (!city) {
            return res.json({
                fulfillmentText: "Please tell me which city you want the weather for.",
                source: 'weather-webhook'
            });
        }
        
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
            );
            
            const weatherData = response.data;
            const weatherDesc = weatherData.weather[0].description;
            const temp = weatherData.main.temp;
            const humidity = weatherData.main.humidity;
            
            const fulfillmentText = `In ${city}, it's ${weatherDesc} with a temperature of ${temp}°C and humidity at ${humidity}%.`;
            
            res.json({
                fulfillmentText: fulfillmentText,
                source: 'weather-webhook'
            });
        } catch (error) {
            console.error('Error fetching weather:', error);
            res.json({
                fulfillmentText: `Sorry, I couldn't get the weather for ${city}. Please try another city.`,
                source: 'weather-webhook'
            });
        }
    } else {
        res.json({
            fulfillmentText: "I'm not sure how to handle that request.",
            source: 'weather-webhook'
        });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));