"use strict";

const mongoose = require("mongoose");

// Định nghĩa Schema và Model
const TestSchema = new mongoose.Schema({
  name: String,
});

const Test = mongoose.model("Test", TestSchema);

describe("mongoose connection", () => {
  let connection;

  // Kết nối trước khi chạy các test
  beforeAll(async () => {
    connection = await mongoose.connect("mongodb://localhost:27017/shopDev", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  // Đóng kết nối sau khi chạy các test
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Test 1: Kiểm tra kết nối MongoDB
  it("should connect", () => {
    expect(mongoose.connection.readyState).toBe(1); // Kiểm tra trạng thái kết nối (1 = kết nối thành công)
  });

  // Test 2: Kiểm tra lưu một document vào MongoDB
  it("should save a document to the database", async () => {
    const user = new Test({
      name: "ha tuan",
    });

    await user.save(); // Lưu user vào MongoDB

    // Kiểm tra xem user đã được lưu chưa
    expect(user.isNew).toBe(false); // Nếu là false, nghĩa là user đã được lưu
  });

  // Test 3: Kiểm tra tìm kiếm một document trong MongoDB
  it("should find a product in the database", async () => {
    const user = await Test.findOne({ name: "ha tuan" });

    // Kiểm tra xem tìm được user chưa
    expect(user).toBeDefined(); // Nếu có user thì expect(user) phải khác undefined

    // Kiểm tra giá trị của trường 'name'
    expect(user.name).toBe("ha tuan");
  });
});
