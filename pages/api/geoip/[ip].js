// given a single IP address, get the location info for it and return some json -- good first endpoint
import nc from "next-connect";

// const Reader = require("@maxmind/geoip2-node").Reader;
import { Reader } from "@maxmind/geoip2-node";

const geoData = [];

const geoIpHandler = nc().get((req, res) => {
  // get the param from the request and create new array
  const ips = [req.query.ip];

  // 1- call the aync reader
  Reader.open("db/GeoLite2-City_08302022.mmdb").then(reader => {
    for (const ip of ips) {
      let ipObj = reader.city(ip);
      // create js obj for easy json and geojson file creation
      geoData.push({
        ipAddress: ipObj.traits.ipAddress,
        city: ipObj?.city?.names?.en, // account for some undefined objects
        timeZone: ipObj.location.timeZone,
        lat: ipObj.location.latitude,
        long: ipObj.location.longitude,
        accuracy: ipObj.location.accuracyRadius,
      });
    }
    // console.log(`geoData is: ${JSON.stringify(geoData)}`);
    res.status(200).send(JSON.stringify(geoData, null, 2) + "\n");
  });
});

export default geoIpHandler;
