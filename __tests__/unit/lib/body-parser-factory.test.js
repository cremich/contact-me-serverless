const factory = require("../../../src/lib/body-parser-factory");

describe("Test body parser factory", function () {
  it("Returns form-urlencoded parser", async () => {
    const parser = factory.createParser("application/x-www-form-urlencoded");
    expect(parser).toBeDefined();
  });

  it("Returns json parser", async () => {
    const parser = factory.createParser("application/json");
    expect(parser).toBeDefined();
  });

  it("Throws error if parser for content-type not registered", async () => {
    const t = () => {
      factory.createParser("unknown");
    };
    expect(t).toThrow("content-type unknown not supported");
  });
});
