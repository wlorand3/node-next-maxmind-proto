// given an IP address, get the location info for it and return some json -- good first endpoint

const getGeoForSingleIp = (req, res) => {
  // get the param from the request
  const ip = req.query.ip;

  // as a first cut just echo it back
  res.status(200).end(`you sent in the ip address ${ip}`);
};

export default getGeoForSingleIp;
