const parser = require("../../../src/lib/json-parser");

describe("Test json parser", function () {
  it("Is able to parse base64 encoded content", async () => {
    const parsedBody = parser.parse(
      "eyJtZXNzYWdlIjoidGhpcyBpcyBhIHRlc3QgbWVzc2FnZSIsInNlbmRlckVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSJ9Cg==",
      true
    );
    expect(parsedBody.senderEmail).toEqual("test@example.com");
    expect(parsedBody.message).toEqual("this is a test message");
  });

  it("Is able to parse non base64 encoded content", async () => {
    const jsonBody = JSON.stringify({
      message: "this is a test message",
      senderEmail: "test@example.com",
    });
    const parsedBody = parser.parse(jsonBody, false);

    expect(parsedBody.senderEmail).toEqual("test@example.com");
    expect(parsedBody.message).toEqual("this is a test message");
  });
});
