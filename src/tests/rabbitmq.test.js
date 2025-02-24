"use strict";

const { connectToRabbitMqTest } = require("../dbs/inits.rabbit");

describe("connectToRabbitMqTest", () => {
  it("should connect to RabbitMQ and return a connection object", async () => {
    const connection = await connectToRabbitMqTest();
    expect(connection).toBeUndefined();
  });
});
