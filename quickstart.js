const { Client, Environment, ApiError } = require("square");
const express = require("express");
const app = express();

app.use(express.json());
const port = 5000;
const { randomUUID } = require("crypto");

const cors = require("cors");
const { response } = require("express");

const corsOption = {
  origin: ["http://localhost:8000"],
};
app.use(cors(corsOption));
//if you want in every domain then
app.use(cors());

const client = new Client({
  accessToken: "access-token",
  environment: Environment.Sandbox,
});

const { locationsApi } = client;
// api / process - payment;
app.post("/", async (req, res) => {
  console.log(req.body.sourceId, "payment");
  try {
    const response = await client.paymentsApi.createPayment({
      sourceId: req.body.sourceId,
      idempotencyKey: randomUUID(),
      amountMoney: {
        amount: 1000,
        currency: "USD",
      },
    });
    // console.log(response);

    const toJson = (data) => {
      return JSON.stringify(data, (_, v) =>
        typeof v === "bigint" ? `${v}n` : v
      ).replace(/"(-?\d+)n"/g, (_, a) => a);
    };
    const hii = toJson(response.result);
    console.log(hii, response.result);

    res.send(hii);
    // res.send("hello");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.get("/", (req, res) => {
  console.log("this is");
  res.send(`Example app listening onnnnn port ${port}`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
