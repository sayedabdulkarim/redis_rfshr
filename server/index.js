import express, { json } from "express";
import "dotenv/config";
import Redis from "ioredis";
import { getProducts } from "./apis/products.js";

const app = express();

export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT, 10),
  password: process.env.REDIS_PASSWORD,
});

redis.on("connect", () => {
  console.log("connected redis");
});
// const client = createClient({
//     password: 'bgCEX3zDfqbiwa3c2PfE1zaMFLzbFxzY',
//     socket: {
//         host: 'redis-16559.c295.ap-southeast-1-1.ec2.redns.redis-cloud.com',
//         port: 16559
//     }
// });

//
app.get("/", (req, res) => {
  res.send("Hello world");
});
//
app.get("/products", async (req, res) => {
  let products = await redis.get("products");

  if (products) {
    products = await redis.get("products");
    return res.json({
      products: JSON.parse(products),
    });
  }

  //

  products = await getProducts();
  await redis.set("products", JSON.stringify(products.products));
  res.json({
    products: products.products,
  });
});

app.listen(8080, () => console.log("connected to 8080"));