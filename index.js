require("dotenv").config();
const Mustache = require("mustache");
const fs = require("fs");

const MUSTACHE_MAIN_DIR = "./main.mustache";

const DATA = {
  refresh_date: new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
    timeZone: "Europe/London",
  }),
};

async function setWeatherInformation() {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=stockholm&appid=${process.env.OPEN_WEATHER_MAP_KEY}&units=metric`,
  );
  const r = await response.json();
  DATA.city_temperature = Math.round(r.main.temp);
  DATA.city_weather = r.weather[0].description;
  DATA.city_weather_icon = r.weather[0].icon;
  DATA.sun_rise = new Date(r.sys.sunrise * 1000).toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/London",
  });
  DATA.sun_set = new Date(r.sys.sunset * 1000).toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/London",
  });
}

async function generateReadMe() {
  const data = await fs.promises.readFile(MUSTACHE_MAIN_DIR);
  const output = Mustache.render(data.toString(), DATA);
  fs.writeFileSync("README.md", output);
}

async function action() {
  /**
   * Fetch Weather
   */
  await setWeatherInformation();

  /**
   * Generate README
   */
  await generateReadMe();
}

action();
