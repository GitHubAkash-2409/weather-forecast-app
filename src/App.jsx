import React from "react";
import CitiesTable from "./components/CitiesTable";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WeatherPage from "./components/WeatherPage";

const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<CitiesTable />}/>
        <Route path="/weather/:cityName" element={<WeatherPage />}/>
      </Routes>
      </BrowserRouter>
      
    </div>
  );
};

export default App;
