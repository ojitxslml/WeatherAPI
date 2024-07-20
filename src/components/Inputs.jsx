import { useState } from "react";
import { BiSearch, BiCurrentLocation } from "react-icons/bi";
import { getCitySuggestions } from "../services/weatherService";

const Inputs = ({ setQuery, setUnits }) => {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleSearchClick = () => {
    if (city !== "") {
      setQuery({ q: city });
      setSuggestions([]);
    }
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setQuery({ lat: latitude, lon: longitude });
      });
    }
  };

  const fetchSuggestions = async (query) => {
    const data = await getCitySuggestions(query);
    setSuggestions(data);
  };

  const handleChange = (e) => {
    setCity(e.target.value);
    if (e.target.value.length > 2) {
      fetchSuggestions(e.target.value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setCity(`${suggestion.name}, ${suggestion.country}`);
    setSuggestions([]);
    setQuery({ q: `${suggestion.name}, ${suggestion.country}` });
  };

  return (
    <div className="flex flex-row justify-center my-6">
      <div className="flex flex-row w-3/4 items-center justify-center space-x-4 relative">
        <input
          value={city}
          onChange={handleChange}
          type="text"
          placeholder="search by city..."
          className="text-gray-500 text-xl font-light p-2 w-full shadow-xl capitalize focus:outline-none placeholder:lowercase rounded-xl"
        />
        <BiSearch
          size={30}
          onClick={handleSearchClick}
          className="cursor-pointer transition ease-out hover:scale-125"
        />
        <BiCurrentLocation
          size={30}
          onClick={handleLocationClick}
          className="cursor-pointer transition ease-out hover:scale-125"
        />
        {suggestions.length > 0 && (
          <div className="text-zinc-800 absolute top-full mt-2 w-full bg-white shadow-lg rounded-md z-10">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="cursor-pointer hover:bg-gray-200 p-2"
              >
                {suggestion.name}, {suggestion.country}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-row w-1/4 items-center justify-center">
        <button
          onClick={() => setUnits("metric")}
          className="text-2xl font-medium transition ease-out hover:scale-125"
        >
          °C
        </button>
        <p className="text-2xl font-medium mx-1">|</p>
        <button
          onClick={() => setUnits("imperial")}
          className="text-2xl font-medium transition ease-out hover:scale-125"
        >
          °F
        </button>
      </div>
    </div>
  );
};

export default Inputs;
