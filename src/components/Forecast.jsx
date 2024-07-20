const Forecast = ({ title, data, units }) => {
  return (
    <div>
      <div className="flex items-center justify-start mt-5">
        <p className="font-medium uppercase">{title}</p>
      </div>
      <hr className="my-1" />
      <div className="flex items-center justify-between">
        {data.map((d, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center"
          >
            <p className="font-light text-sm">{d.title}</p>
            <img
              src="https://openweathermap.org/img/wn/10d@2x.png"
              alt="weather icon"
              className="w-12 my-1"
            />
            <p className="font-medium">
              {`${d.temp.toFixed()}° ${units === "metric" ? "C" : "F"}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;
