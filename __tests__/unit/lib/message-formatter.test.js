const formatter = require("../../../src/lib/message-formatter");

describe("Test json parser", function () {
  it("Is formatting message parts to a single message", async () => {
    const messageParts = {
      senderEmail: "me@example.org",
      text: "This is a test...",
    };

    const expectedMessage =
      "Sender: me@example.org\n\nMessage:\nThis is a test...";

    const message = formatter.format(messageParts);
    expect(message).toBe(expectedMessage);
  });
});
