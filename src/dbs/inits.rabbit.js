"use strict";

const amqplib = require("amqplib");
const sendEmailService = require("../service/sendEmailService");

// Kết nối đến RabbitMQ
const connectToRabbitMq = async () => {
  try {
    const connection = await amqplib.connect("amqp://rabbitmq");
    if (!connection) throw new Error("Failed to connect to RabbitMQ");
    const channel = await connection.createChannel();
    return { channel, connection };
  } catch (e) {
    console.error("Error connecting to RabbitMQ:", e.message);
    throw e; // Ném lỗi ra ngoài để có thể xử lý ở nơi gọi
  }
};

const connectToRabbitMqTest = async () => {
  try {
    const { channel, connection } = await connectToRabbitMq();
    // Đặt tên queue và message
    const queue = "Test Topic";
    const message = "Hello from RabbitMQ";

    // Đảm bảo queue tồn tại và gửi tin nhắn
    await channel.assertQueue(queue);
    await channel.sendToQueue(queue, Buffer.from(message));

    console.log(`Message sent to queue "${queue}": ${message}`);

    // Đóng kênh và kết nối
    await connection.close();
  } catch (e) {
    console.error("Error in connectToRabbitMqTest:", e.message);
  }
};

const consumerQueue = async (channel, queueName) => {
  try {
    await channel.assertQueue(queueName, { durable: true });

    console.log(
      `[*] Waiting for messages in ${queueName}. To exit press CTRL+C`
    );

    channel.consume(queueName, async (msg) => {
      if (msg !== null) {
        try {
          const messageContent = JSON.parse(msg.content.toString());
          console.log("📩 Received message:", messageContent);

          if (Array.isArray(messageContent)) {
            let emailContent = messageContent
              .map(
                (item) =>
                  `- ${item.ingredientNameAtPurchase}: Còn ${item.remainingStock} sản phẩm`
              )
              .join("\n");

            if (emailContent) {
              console.log("📧 Sending email...");
              const emailResponse = await sendEmailService(
                "22a1001d0351@students.hou.edu.vn",
                emailContent
              );

              if (emailResponse.success) {
                console.log("✅ Email sent successfully!");
              } else {
                console.error(
                  "❌ Failed to send email:",
                  emailResponse.message
                );
              }
            }
          } else {
            console.error(
              "❌ Received message is not an array:",
              messageContent
            );
          }

          if (channel && channel.connection) {
            channel.ack(msg); // Chỉ gọi ACK nếu channel còn hoạt động
          }
        } catch (error) {
          console.error("❌ Lỗi xử lý message:", error.message);
        }
      }
    });

    // Lắng nghe sự kiện lỗi và đóng kết nối
    channel.on("error", (err) => {
      console.error("❌ Lỗi channel:", err.message);
    });

    channel.on("close", () => {
      console.warn("⚠️ Channel bị đóng, thử kết nối lại...");
      setTimeout(() => consumerQueue(channel, queueName), 5000);
    });
  } catch (error) {
    console.error(`❌ Error in consumerQueue (${queueName}):`, error.message);
  }
};

module.exports = {
  connectToRabbitMq,
  connectToRabbitMqTest,
  consumerQueue,
};
