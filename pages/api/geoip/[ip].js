/**
 * FILE: /pages/geoip/[ip].js
 * DESC: given a single IP address as GET query param, return location info as json
 **/
import nc from "next-connect";
import { Reader } from "@maxmind/geoip2-node";

const geoData = [];

const geoIpHandler = nc().get((req, res) => {
  const ips = [req.query.ip];

  Reader.open("db/GeoLite2-City_08302022.mmdb").then(reader => {
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
    res.status(200).send(JSON.stringify(geoData, null, 2) + "\n");
  });
});

export default geoIpHandler;
