// TODO: pin aws-sdk via lambda layer
const AWS = require("aws-sdk");
const validator = require("validator");
const bodyParserFactory = require("../lib/body-parser-factory");
const formatter = require("../lib/message-formatter");

exports.handle = async (event) => {
  let statusCode = 200;
  let body = "";
  try {
    const parser = bodyParserFactory.createParser(
      event.headers["content-type"]
    );
    const message = parser.parse(event.body, event.isBase64Encoded);
    validateSenderEmail(message.senderEmail);
    validateMessageText(message.text);
    await sendEmail(message);
  } catch (e) {
    statusCode = 400;
    body = JSON.stringify({ errorMessage: e.message });
  }

  return {
    statusCode,
    body,
  };
};

const validateSenderEmail = (senderEmail) => {
  if (!validator.isEmail(senderEmail)) {
    throw Error("invalid-email");
  }
};

const validateMessageText = (text) => {
  if (!text || validator.isEmpty(text)) {
    throw Error("empty-message-text");
  }
};

const sendEmail = async (parsedMessageParts) => {
  const message = formatter.format(parsedMessageParts);
  ensureMessageSizeIsBelowSNSLimit(message);
  const sns = new AWS.SNS();
  const params = {
    Message: message,
    Subject: process.env.SUBJECT,
    TopicArn: process.env.SNS_TOPIC,
  };

  return sns.publish(params).promise();
};

const ensureMessageSizeIsBelowSNSLimit = (message) => {
  if (!validator.isByteLength(message, { min: 0, max: 256 })) {
    throw Error("sns-message-payload-too-big");
  }
};
