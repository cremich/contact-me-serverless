const AWS = require("aws-sdk-mock");
const lambda = require("../../../src/handlers/contact.js");
const tooBigMessage = require("../samples/too-big-message.json");

describe("Test contact lambda", function () {
  beforeEach(async () => {
    process.env = Object.assign(process.env, { CRAWLER: "test-crawler" });

    AWS.mock("SNS", "publish", function (params, callback) {
      callback();
    });
  });

  it("Response is 200 on valid request", async () => {
    const event = {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: "c2VuZGVyRW1haWw9dGVzdCU0MGV4YW1wbGUuY29tJnRleHQ9dGVzdAo=",
      isBase64Encoded: true,
    };

    const response = await lambda.handle(event);
    expect(response.statusCode).toEqual(200);
  });

  it("Response is 400 if content-type can not be processed", async () => {
    const event = {
      headers: {
        "content-type": "application/xml",
      },
    };

    const response = await lambda.handle(event);
    expect(response.statusCode).toEqual(400);
  });

  it("Response is 400 if sender email is invalid", async () => {
    const event = {
      headers: {
        "content-type": "application/json",
      },
      body: '{"text": "hello world", "senderEmail": "me@ex@ample.com"}',
      isBase64Encoded: false,
    };

    const response = await lambda.handle(event);
    const jsonBody = JSON.parse(response.body);
    expect(response.statusCode).toEqual(400);
    expect(jsonBody.errorMessage).toEqual("invalid-email");
  });

  it("Response is 400 if message is not set", async () => {
    const event = {
      headers: {
        "content-type": "application/json",
      },
      body: '{"senderEmail": "me@example.com"}',
      isBase64Encoded: false,
    };

    const response = await lambda.handle(event);
    const jsonBody = JSON.parse(response.body);
    expect(response.statusCode).toEqual(400);
    expect(jsonBody.errorMessage).toEqual("empty-message-text");
  });

  it("Response is 400 if message is empty", async () => {
    const event = {
      headers: {
        "content-type": "application/json",
      },
      body: '{"senderEmail": "me@example.com", "text": ""}',
      isBase64Encoded: false,
    };

    const response = await lambda.handle(event);
    const jsonBody = JSON.parse(response.body);
    expect(response.statusCode).toEqual(400);
    expect(jsonBody.errorMessage).toEqual("empty-message-text");
  });

  it("Response is 400 if message is too big", async () => {
    const event = {
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(tooBigMessage),
      isBase64Encoded: false,
    };

    const response = await lambda.handle(event);
    const jsonBody = JSON.parse(response.body);
    expect(response.statusCode).toEqual(400);
    expect(jsonBody.errorMessage).toEqual("sns-message-payload-too-big");
  });

  afterAll(function () {
    AWS.restore("SNS");
  });
});
