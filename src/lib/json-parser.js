exports.parse = (body, isBase64) => {
  let encodedBody = body;
  if (isBase64) {
    const bufferedBody = Buffer.from(body, "base64");
    encodedBody = bufferedBody.toString("utf-8");
  }
  const params = JSON.parse(encodedBody);
  const parsedMessageParts = {};
  Object.keys(params).forEach((key) => {
    parsedMessageParts[key] = params[key];
  });

  return parsedMessageParts;
};
