import requestIp from "request-ip";
import _ from "underscore";

const extractIPfromRequest = req => {
  const ip = requestIp.getClientIp(req);
  return stripIPV6prefix(ip);
};

const stripIPV6prefix = ip => ip.replace(/^.*:/, "");

export default { extractIPfromRequest };
