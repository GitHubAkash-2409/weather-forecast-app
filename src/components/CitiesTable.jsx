import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";

const CitiesTable = () => {
  const [cities, setCities] = useState([]);
  const [searchCity, setSearchCity] = useState("");
  const [filterCities, setFilterCities] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getCitiesData();
  }, []);

  const getCitiesData =  () => {

    setTimeout(async() => {
      try {
        const res = await axios.get(
          `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=20&offset-${
            (currentPage - 1) * 10
          }`
        );
        const newCities = res.data.results;
        setCities((prevCities) => [...prevCities, ...newCities]);
        // Check if there are more data to laod
        setCurrentPage((prevPage) => prevPage + 1);
        if (newCities.length === 0) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error Found:", error);
      }
    }, 1000);

    
  };

  // console.log(cities);

  const handleSearchCity = (e) => {
    setSearchCity(e.target.value);
  };

  useEffect(() => {
    const filterCity = cities.filter((city) =>
      city.name.toLowerCase().includes(searchCity.toLowerCase())
    );

    // console.log("filter city", filterCity);
    setFilterCities(filterCity);
  }, [cities, searchCity]);

  const handleRightClick = (e, cityName) => {
    e.preventDefault();
    window.open(`/weather/${cityName}`, "_blank");
  };

  return (
    <div className="container flex flex-col justify-center items-center mx-auto p-4">
      <h1 className="text-center font-semibold text-4xl mt-[10px] mb-[10px]">
        Cities Data
      </h1>
      <div className="flex items-center w-[50%] mt-4 mb-4 p-3 border rounded-lg">
        <input
          placeholder="Search cities..."
          className="flex-grow border-none outline-none"
          onChange={handleSearchCity}
          value={searchCity}
        />
        <FaSearch size={25} className="text-gray-500 ml-2" />
      </div>
      <div className="relative overflow-x-auto w-full">
        <InfiniteScroll
          dataLength={cities.length}
          next={getCitiesData}
          hasMore={hasMore}
          loader={<h4 className="text-center font-bold mt-2 mb-2">Loading...</h4>}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>No More Data to Load</b>
            </p>
          }
        >
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  City Name
                </th>
                <th scope="col" className="px-6 py-3">
                  geoname_id
                </th>
                <th scope="col" className="px-6 py-3">
                  Country
                </th>
                <th scope="col" className="px-6 py-3">
                  country_code
                </th>
                <th scope="col" className="px-6 py-3">
                  Timezone
                </th>
                <th scope="col" className="px-6 py-3">
                  Population
                </th>
              </tr>
            </thead>
            <tbody>
              {filterCities.length > 0 ? (
                filterCities.map((city, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer"
                      onContextMenu={(e) => handleRightClick(e, city.name)}
                    >
                      <Link to={`/weather/${city.name}`}>{city.name}</Link>
                    </th>
                    <td className="px-6 py-4">{city.geoname_id}</td>
                    <td className="px-6 py-4">{city.cou_name_en}</td>
                    <td className="px-6 py-4">{city.country_code}</td>
                    <td className="px-6 py-4">{city.timezone}</td>
                    <td className="px-6 py-4">{city.population}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default CitiesTable;
