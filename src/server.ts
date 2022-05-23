import express from "express";
require("dotenv").config();

const app = express();

app.use(express.json());

app.listen(3333, () => {
  console.log("Server is running on port 3333");
})

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.post("/users", (req, res) => {
  const { name, email } = req.body;

  const user = {
    name,
    email,
  };

  return res.status(201).send;
})
