import { useEffect, useState, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import TopButtons from "./components/TopButtons";
import Inputs from "./components/Inputs";
import TimeAndLocation from "./components/TimeAndLocation";
import TempAndDetails from "./components/TempAndDetails";
import Forecast from "./components/Forecast";
import { getFormattedWeatherData } from "./services/weatherService";

const App = () => {
  const [query, setQuery] = useState({ q: "Santiago" });
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false); // Estado para controlar la carga

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const getWeather = useCallback(async () => {
    setLoading(true); // Iniciar carga

    const message = query.q ? query.q : "current location";

    // Utiliza toast.promise para mostrar notificaciones de carga, éxito o error
    toast.promise(getFormattedWeatherData({ ...query, units }), {
      loading: `Fetching data for ${capitalizeFirstLetter(message)}`,
      success: (data) => {
        setWeather(data);
        setLoading(false); // Finalizar carga exitosa
        return "Got the data";
      },
      error: (err) => {
        setLoading(false); // Finalizar carga con error
        return `Error: ${err.message}`;
      },
    });
  }, [query, units]);

  useEffect(() => {
    const fetchData = async () => {
      await getWeather();
    };
    fetchData();
  }, [query, units, getWeather]);

  const formatBackground = () => {
    if (!weather) return "from-cyan-600 to-blue-700";
    const threshold = units === "metric" ? 20 : 60;
    return weather.temp <= threshold
      ? "from-cyan-600 to-blue-700"
      : "from-yellow-500 to-orange-500";
  };

  return (
    <div
      className={`mx-auto max-w-screen-lg flex flex-col justify-center text-center rounded-xl sm:px-6 lg:px-32 mt-4 py-5 px-4 bg-gradient-to-br shadow-xl ${formatBackground()}`}
    >
      <TopButtons setQuery={setQuery} />
      <Inputs setQuery={setQuery} setUnits={setUnits} />
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex p-0 h-full w-full items-center justify-center backdrop-blur-2xl rounded-2xl text-white text-xl font-bold">
            Loading...
          </div>
        )}
        {weather ? (
          <>
            <TimeAndLocation weather={weather} />
            <TempAndDetails weather={weather} units={units} />
            <Forecast
              title={"3 hour step forecast"}
              data={weather.hourly}
              units={units}
            />
            <Forecast
              title={"daily forecast"}
              data={weather.daily}
              units={units}
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-xl font-light">Loading...</p>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default App;
