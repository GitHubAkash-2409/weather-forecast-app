import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import cloudIcon from "../assets/cloudy.png";
import rainyIcon from "../assets/rainy.jpg";
import sunnyIcon from "../assets/sunny.jpg";
import clearSkyIcon from "../assets/clearSky.jpg";
import bgCloudy from "../assets/bgCloudy.jpg";
import bgRainy from "../assets/bgRainny.jpg";
import bgSunny from "../assets/bgSunny.jpg";
import bgClearSky from "../assets/clearSky.jpg";
import ForeCast from "./ForeCast";

const WeatherPage = () => {
  const APIKEY = import.meta.env.VITE_API_KEY;

  const { cityName } = useParams();

  const [weatherData, setWeatherData] = useState(null);
  const [weatherIcon, setWeatherIcon] = useState(null);
  const [bgWeatherImg, setBgWeatherImg] = useState(null);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          cityName
        )}&appid=${APIKEY}&units=metric`
      );
        setWeatherData(res.data);
      } catch (error) {
        console.error("Error fetching the weather data:", error);
      }
    };

    fetchWeather();
  }, [cityName, APIKEY]);

  useEffect(() => {
    if (weatherData) {
      switch (weatherData.weather[0].main) {
        case "Clouds":
          setWeatherIcon(cloudIcon);
          setBgWeatherImg(bgCloudy);
          break;
        case "Rain":
          setWeatherIcon(rainyIcon);
          setBgWeatherImg(bgRainy);
          break;
        case "Clear":
          setWeatherIcon(clearSkyIcon);
          setBgWeatherImg(bgClearSky);
          break;
        case "Sunny":
          setWeatherIcon(sunnyIcon);
          setBgWeatherImg(bgSunny);
          break;
        default:
          setWeatherIcon(sunnyIcon);
          setBgWeatherImg(bgSunny);
          break;
      }
    }

    const date = new Date();
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    setCurrentDate(date.toLocaleDateString("en-US", options));
    
  }, [weatherData]);

  if (!weatherData) {
    return <div className="text-center mt-6">Loading...</div>;
  }

  return (
    <div>
    <div className="flex  flex-col justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgWeatherImg})` }}>
      <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-md w-full max-w-lg mx-4">
        <div className="text-md font-bold flex flex-col text-gray-900">
          <span className="uppercase">Today</span>
          <span className="uppercase">{currentDate}</span>
        </div>
        <div className="w-32 h-32 flex items-center justify-center mx-auto mt-4">
          <img src={weatherIcon} alt="Weather Icon" className="w-full h-full object-contain" />
        </div>
        <div className="font-bold text-gray-900 flex flex-col items-center mt-4">
          <span className="text-5xl">
            {weatherData.main.temp.toFixed(2)}°C
          </span>
          <span className="font-normal text-gray-700 text-sm mt-2">
            Feels like {weatherData.main.feels_like.toFixed(0)}°C
          </span>
        </div>
        <div className="text-gray-700 flex flex-col text-sm mt-3 text-center">
          <span>{cityName}</span>
          <span>{weatherData.weather[0].description}</span>
        </div>
        <div className="flex justify-between gap-2 w-full mt-4">
          <div className="flex flex-col items-center justify-center p-2 border border-gray-300 rounded-md text-gray-700 w-full bg-white bg-opacity-70">
            <span className="text-sm">Humidity</span>
            <span className="text-sm font-bold">
              {weatherData.main.humidity}%
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 border border-gray-300 rounded-md text-gray-700 w-full bg-white bg-opacity-70">
            <span className="text-sm">Wind</span>
            <span className="text-sm font-bold">
              {weatherData.wind.speed} km/h
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 border border-gray-300 rounded-md text-gray-700 w-full bg-white bg-opacity-70">
            <span className="text-sm">Pressure</span>
            <span className="text-sm font-bold">
              {weatherData.main.pressure} hPa
            </span>
          </div>
        </div>
      </div>
      </div>
      <ForeCast/>

    </div>
    
  );
};

export default WeatherPage;
