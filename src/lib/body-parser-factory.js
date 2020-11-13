const formUrlEncodedParser = require("./form-urlencoded-parser");
const jsonParser = require("./json-parser");

exports.createParser = (contentType) => {
  if (contentType === "application/x-www-form-urlencoded") {
    return formUrlEncodedParser;
  }
  if (contentType === "application/json") {
    return jsonParser;
  }
  throw Error(`content-type ${contentType} not supported.`);
};
