import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import cloudIcon from "../assets/cloudy.png";
import rainyIcon from "../assets/rainy.jpg";
import sunnyIcon from "../assets/sunny.jpg";
import clearSkyIcon from "../assets/clearSky.jpg";

const ForeCast = () => {
  const APIKEY = import.meta.env.VITE_API_KEY;

  const { cityName } = useParams();

  const [foreCastData, setForeCastData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForeCastData = async () => {
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
            cityName
          )}&appid=${APIKEY}&units=metric`
        );
        const dailyForeCasts = res.data.list.filter(
          (item, index) => index % 8 === 0
        );
        setForeCastData(dailyForeCasts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching the weather data:", error);
        setLoading(false);
      }
    };

    fetchForeCastData();
  }, [cityName, APIKEY]);

//   console.log(foreCastData);

  const getWeatherIcon = (main) => {
    switch (main) {
      case "Clouds":
        return cloudIcon;
      case "Rain":
        return rainyIcon;
      case "Clear":
        return clearSkyIcon;
      default:
        return sunnyIcon;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4 mt-4">
        Forecast for {cityName}
      </h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {foreCastData.map((day, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg shadow-md flex flex-col items-center"
            >
              <p className="text-lg font-semibold">
                {new Date(day.dt_txt).toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <img
                src={getWeatherIcon(day.weather[0].main)}
                alt="Weather icon"
                className="w-24 h-24 my-2"
              />
              <p className="text-xl font-semibold mt-3 mb-5">
                {day.weather[0].description}
              </p>
              <p className="text-xl font-semibold">
                Temperature: {day.main.temp.toFixed(2)}°C
              </p>
              <p className="text-xl font-semibold">
                Humidity: {day.main.humidity}%
              </p>
              <p className="text-xl font-semibold">
                Pressure: {day.main.pressure}bar
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ForeCast;
