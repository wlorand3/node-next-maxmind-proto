/**
 * FILE: /pages/geoip/index.js
 * DESC: given an array of IP addresses as a POST request, return location info as json
 **/

import nc from "next-connect";
import { Reader } from "@maxmind/geoip2-node";

const geoData = [];

const geoIpsHandler = nc()
  .get((req, res) => {
    res
      .status(200)
      .end(
        "GET not supported, please use POST with a body of IP Address data \n"
      );
  })
  .post((req, res) => {
    const ips = req.body;

    Reader.open("db/GeoLite2-City_08302022.mmdb").then(reader => {
      for (const ip of ips) {
        let ipObj = reader.city(ip);

        geoData.push({
          ipAddress: ipObj.traits.ipAddress,
          city: ipObj?.city?.names?.en, // account for undefined cities
          timeZone: ipObj.location.timeZone,
          lat: ipObj.location.latitude,
          long: ipObj.location.longitude,
          accuracy: ipObj.location.accuracyRadius,
        });
      }
      res.status(200).send(JSON.stringify(geoData, null, 2) + "\n");
    });
  });

export default geoIpsHandler;
