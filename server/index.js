const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const sequelize = require("./sequelize");
const { SERVER_PORT } = process.env;
//middleware
app.use(express.json());
app.use(cors());

//Routes

//Register and login routes

app.use("/auth", require("./routes/jwtAuth"));

//Dashboard route

app.use("/dashboard", require("./routes/dashboard"));

const seed = (req, res) => {
  sequelize
    .query(
      `
      create table user_reading_times(
        user_reading_times_id serial primary key,
        user_id integer references users (user_id),
        reading_time_id integer references reading_times (reading_time_id)
      );
    `
    )
    .then(() => {
      console.log("DB Seeded!");
      res.sendStatus(200);
    })
    .catch((err) => console.log("error seeding db", err));
};

app.post("/seed", seed);

app.listen(SERVER_PORT, () =>
  console.log(`Server is running on port ${SERVER_PORT}`)
);
