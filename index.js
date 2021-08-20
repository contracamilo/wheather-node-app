const {
  iqMenu,
  iqPause,
  readInput,
  listPlaces,
} = require("./helpers/inquirer");
const Searches = require("./models/searches");

const main = async () => {
  let opt = "";
  const searches = new Searches();

  do {
    opt = await iqMenu();

    switch (opt) {
      case 1:
        const searchCriteria = await readInput("City: ");
        const places = await searches.getCity(searchCriteria);

        const selectedId = await listPlaces(places);

        if (selectedId === "0") continue;

        const { id, name, lng, lat } = places.find(
          (place) => place.id === selectedId
        );

        //save
        searches.saveRecords(name);

        const weather = await searches.getWeather(lng, lat);

        const { description, min, max, temperature } = weather;

        console.log("\nCity Info\n".green);
        console.log("City: " + `${name}`.green);
        console.log("Lat: " + `${lat}`.green + " Long: " + `${lng}`.green);
        console.log("Temperature: " + `${temperature} ºC`.green);
        console.log("Min: " + `${min} ºC`.green + " Max: " + `${max} ºC`.green);
        console.log("How is the weather?: " + `${description}`.green);
        break;
      case 2:
        searches.history.forEach((place, index) => {
          const idx = `${++index}`.green;
          console.log(`${idx} ${place}`);
        });
        break;
      default:
        break;
    }

    if (opt !== 0) await iqPause();
  } while (opt !== 0);
};

main();
