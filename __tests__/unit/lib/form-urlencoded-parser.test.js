const parser = require("../../../src/lib/form-urlencoded-parser");

describe("Test form-urlencoded parser", function () {
  it("Is able to parse base64 encoded content", async () => {
    const parsedBody = parser.parse(
      "c2VuZGVyRW1haWw9dGVzdCU0MGV4YW1wbGUuY29tJm1lc3NhZ2U9dGhpcyUyMGlzJTIwYSUyMHRlc3QlMjBtZXNzYWdl",
      true
    );
    expect(parsedBody.senderEmail).toEqual("test@example.com");
    expect(parsedBody.message).toEqual("this is a test message");
  });

  it("Is able to parse non base64 encoded content", async () => {
    const parsedBody = parser.parse(
      "senderEmail=test%40example.com&message=this%20is%20a%20test%20message",
      false
    );
    expect(parsedBody.senderEmail).toEqual("test@example.com");
    expect(parsedBody.message).toEqual("this is a test message");
  });
});
