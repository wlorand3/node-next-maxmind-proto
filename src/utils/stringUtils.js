// using IPv4 RegExp from iHateGegex: https://ihateregex.io/expr/ip/
export const isIPv4 = str =>
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/.test(
    str
  );
