import express, { json } from "express";
import "dotenv/config";
import Redis from "ioredis";
import { getProductDetail, getProducts } from "./apis/products.js";
import { getCachedData } from "./middleware/redisMiddleware.js";

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
// app.get("/products", async (req, res) => {
//   let products = await redis.get("products");

//   if (products) {
//     products = await redis.get("products");
//     return res.json({
//       products: JSON.parse(products),
//     });
//   }

//   products = await getProducts();
//   await redis.set("products", JSON.stringify(products.products));
//   res.json({
//     products: products.products,
//   });
// });
//with midWare

const getCachedData1 = (key) => async (req, res, next) => {
  let data = await redis.get(key);

  if (data)
    return res.json({
      products: JSON.parse(data),
    });

  next();
};

app.get("/products", getCachedData1("products"), async (req, res) => {
  const products = await getProducts();
  await redis.set("products", JSON.stringify(products.products));
  res.json({
    products: products.products,
  });
});
//
app.get("/product/:id", async (req, res) => {
  const id = req.params.id;
  const key = `product:${id}`;
  let product = await redis.get(key);

  if (product) {
    return res.json({
      products: JSON.parse(product),
    });
  }

  product = await getProductDetail(id);
  await redis.set(key, JSON.stringify(product.product));

  res.json({ product: product.product });
});

app.get("/order/:id", async (req, res) => {
  const productId = req.params.id;
  const key = `product:${productId}`;

  // real be stufffs
  // Any mutation to database here
  // Like creating new order in database
  // reducing the product stock in database

  await redis.del(key);

  return res.json({
    message: `Order placed successfully, product id:${productId} is ordered.`,
  });
});

app.listen(8080, () => console.log("connected to 8080"));
