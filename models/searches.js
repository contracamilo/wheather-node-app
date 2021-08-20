require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const { MAPBOX_KEY, OPENWEATHER_KEY } = process.env;

class Searches {
  history = [];
  dbPath = "./db/database.json";

  constructor() {
    this.readDB();
  }

  get paramsProvider() {
    return {
      access_token: MAPBOX_KEY,
      limit: 5,
      language: "en",
    };
  }

  async getCity(place = "") {
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
        timeout: 1000,
        params: this.paramsProvider,
        headers: { "X-Custom-Header": "foobar" },
      });

      const response = await instance.get();
      const places = response?.data?.features;

      return places.map((place) => ({
        id: place.id,
        name: place.place_name,
        lng: place.center[0],
        lat: place.center[1],
      }));
    } catch (error) {
      return [];
    }
  }

  async getWeather(lng = "", lat = "") {
    try {
      const instance = axios.create({
        baseURL: "https://api.openweathermap.org/data/2.5/weather",
        params: {
          lat,
          lon: lng,
          appid: OPENWEATHER_KEY,
          units: "metric",
          lang: "en",
        },
      });

      const response = await instance.get();
      const { weather, main } = response?.data;

      return {
        description: weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
        temperature: main.temp,
      };
    } catch (error) {
      return [];
    }
  }

  saveRecords(place = "") {
    if (this.history.includes(place.toLocaleLowerCase())) {
      return;
    }

    this.history = this.history.splice(0, 6);

    this.history.unshift(place);
    this.storeDB();
  }

  storeDB() {
    const payload = {
      history: this.history,
    };
    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  readDB() {
    if (!fs.existsSync(this.dbPath)) return null;

    const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
    const { history } = JSON.parse(info);

    this.history = [...this.history, ...history];
  }
}

module.exports = Searches;
