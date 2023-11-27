/**
 * FILE: /pages/geoip/[ip].js
 * DESC: given a single IP address as GET query param, return location info as json
 **/
import nc from "next-connect";
import { Reader } from "@maxmind/geoip2-node";

import GeoJSON from "geojson";

import { isIPv4 } from "../../../src/utils/stringUtils";

// const dbFile = "db/GeoLite2-City_08302022.mmdb";
const dbFile = "db/dbip-city-lite-2023-11.mmdb";

const geoData = [];

const geoIpHandler = nc().get((req, res) => {
  // const ips = [req.query.ip];

  const query = req.query;
  const { ip, format = "json" } = query;

  // check for valid IP address
  if (!isIPv4(ip)) res.status(400).send("Invalid IP Address");

  const ips = [ip]; // create array for looping

  Reader.open(dbFile).then((reader) => {
    for (const ip of ips) {
      let ipObj = reader.city(ip);

      geoData.push({
        ipAddress: ipObj.traits.ipAddress,
        city: ipObj?.city?.names?.en, // account for some undefined objects
        timeZone: ipObj.location.timeZone,
        lat: ipObj.location.latitude,
        long: ipObj.location.longitude,
        accuracy: ipObj.location.accuracyRadius,
      });
    }

    // return different json formats
    if (format === "geojson") {
      const geoDataGeoJson = GeoJSON.parse(geoData, { Point: ["lat", "long"] });
      res.status(200).send(JSON.stringify(geoDataGeoJson, null, 2) + "\n");
    } else {
      const geoDataJson = JSON.stringify(geoData, null, 2);
      res.status(200).send(geoDataJson + "\n");
    }
  });
});

export default geoIpHandler;
