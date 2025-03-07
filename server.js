const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {
  messagesService,
} = require("../../sys_message_queue_shop/src/service/consumerQueue.service"); // Đảm bảo bạn import đúng module

const app = express();
const port = 2001;

app.use(
  cors({
    origin: "http://localhost:7000",
    credentials: true,
  })
);

const routes = require("./src/router");
const connectDB = require("./config/mongodb");
const consumeNotifications = require("./src/consumers/notificationConsumer");
const { startConsumer } = require("./src/consumers/consumer");
const { consumerQueue } = require("./src/dbs/inits.rabbit");
app.use(express.json());

routes(app);
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

connectDB();
consumeNotifications();
startConsumer();

const queueName = "sendMail";
consumerQueue(queueName).then(() => {
  console.log(`Message consumer started for queue: ${queueName}`);
});

app.get("/", (req, res) => {
  res.send("Hello, Service 2 is running!");
});

app.listen(port, () => {
  console.log(`Service 2 is running on http://localhost:${port}`);
});
