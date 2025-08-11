const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.json());

const API_KEY = 'f89c5e285d63eff12caeb403f0946c91'; // Replace with your key

app.get('/', (req, res) => {
  res.send('Weather webhook is running!');
});

app.post('/webhook', async (req, res) => {
  const city = req.body.queryResult.parameters['geo-city'];

  if (!city) {
    return res.json({
      fulfillmentText: "Please tell me which city you want the weather for."
    });
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      return res.json({
        fulfillmentText: `I couldn't find the weather for ${city}.`
      });
    }

    const temp = data.main.temp;
    const weather = data.weather[0].description;

    return res.json({
      fulfillmentText: `The current temperature in ${city} is ${temp}°C with ${weather}.`
    });

  } catch (error) {
    console.error(error);
    return res.json({
      fulfillmentText: `Sorry, I couldn't fetch the weather for ${city}.`
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));