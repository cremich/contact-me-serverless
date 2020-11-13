const validator = require("validator");

exports.format = (parsedMessageParts) => {
  // TODO: sanizite message text
  const sanitizedEmail = validator.normalizeEmail(
    parsedMessageParts.senderEmail
  );
  const sanitizedText = validator.escape(parsedMessageParts.text);

  let formattedMessage = `Sender: ${sanitizedEmail}\n\n`;
  formattedMessage += `Message:\n${sanitizedText}`;

  return formattedMessage;

  //   return `Sender: ${parsedMessageParts.senderEmail}
  //
  // Message:
  // ${parsedMessageParts.text}
  // `;
};
